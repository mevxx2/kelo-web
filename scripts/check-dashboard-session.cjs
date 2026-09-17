// Regression checks against the actual dashboard's refresh callback. All
// authentication/database responses are synthetic; this never contacts Supabase.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../components/agency/agency-dashboard.tsx'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
function harness() {
  const state = [], effects = [], refs = [];
  let refresh, scenario = 'valid', signedOut = 0, redirected = '', authListener;
  const query = (table) => {
    const result = () => {
      if (scenario === 'notes-failed' && table === 'handoff_notes') return { data: null, error: { message: 'Network failure' } };
      if (table === 'profiles') return { data: scenario === 'profile-deleted' ? null : { name: 'Test leader', role: 'team_leader', agency_id: 'agency' }, error: null };
      if (table === 'agencies') return { data: scenario === 'agency-deleted' ? null : { name: 'Test agency', leader_id: 'leader' }, error: null };
      return { data: [], error: null };
    };
    const chain = { select: () => chain, eq: () => chain, order: () => chain, maybeSingle: async () => result(), then: (resolve) => Promise.resolve(result()).then(resolve) };
    return chain;
  };
  const supabase = {
    auth: {
      getUser: async () => scenario === 'account-deleted' ? { data: { user: null }, error: { status: 403, name: 'AuthApiError' } } : scenario === 'offline' ? { data: { user: null }, error: { name: 'AuthRetryableFetchError' } } : { data: { user: { id: 'leader', email: 'leader@example.test' } }, error: null },
      signOut: async () => { signedOut++; },
      onAuthStateChange: (fn) => { authListener = fn; return { data: { subscription: { unsubscribe() {} } } }; },
    },
    from: query,
    rpc: async () => ({ data: [], error: null }),
    channel: () => { const channel = { on: () => channel, subscribe: () => channel }; return channel; },
    removeChannel: async () => {},
  };
  const react = {
    useState(initial) { const index = state.length; state.push(initial); return [initial, value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }]; },
    useRef(initial) { const ref = { current: initial }; refs.push(ref); return ref; },
    useCallback(fn) { refresh = fn; return fn; },
    useEffect(fn) { effects.push(fn); },
  };
  const mod = { exports: {} };
  function requireMock(id) {
    if (id === 'react') return react;
    if (id === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
    if (id === 'next/navigation') return { useRouter: () => ({ replace: (url) => { redirected = url; } }) };
    if (id.endsWith('supabase/client')) return { supabase };
    if (id === '@/lib/utils') return { cn: (...values) => values.filter(Boolean).join(' ') };
    return {};
  }
  new Function('require', 'module', 'exports', code)(requireMock, mod, mod.exports);
  mod.exports.AgencyDashboard();
  return { state, effects, refs, supabase, refresh: () => refresh(), set: value => { scenario = value; }, stats: () => ({ signedOut, redirected }), signOutEvent: () => authListener('SIGNED_OUT') };
}

(async () => {
  for (const removed of ['account-deleted', 'profile-deleted', 'agency-deleted']) {
    const h = harness(); await h.refresh(); assert.ok(h.state[1]);
    h.set(removed); await h.refresh();
    assert.equal(h.state[1], null, `${removed} must clear previously loaded care records`);
    assert.equal(h.stats().redirected, '/for-agencies'); assert.equal(h.stats().signedOut, 1);
  }
  for (const failure of ['offline', 'notes-failed']) {
    const h = harness(); await h.refresh(); h.set(failure); await h.refresh();
    assert.equal(h.state[1], null); assert.match(h.state[2], /couldn't verify/);
    assert.equal(h.stats().signedOut, 0, 'Transient failures must not invalidate a valid account');
    h.set('valid'); await h.refresh(); assert.ok(h.state[1], 'Refresh must recover');
  }
  const h = harness();
  let resolveUser;
  h.supabase.auth.getUser = () => new Promise(resolve => { resolveUser = resolve; });
  const pending = h.refresh();
  h.refs[0].current++;
  resolveUser({ data: { user: { id: 'leader' } }, error: null });
  await pending; assert.equal(h.state[1], null, 'An obsolete request must not restore care data after sign-out');
  console.log('PASS: deleted account/profile/agency, failed reads, offline recovery, and obsolete refresh responses.');
})().catch(error => { console.error(error); process.exitCode = 1; });
