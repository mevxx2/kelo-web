import Image from "next/image";
import Link from "next/link";
import "./agency.css";

export default function AgenciesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="ag-bar">
        <div className="ag-bar-in">
          <Link className="ag-logo" href="/for-agencies" aria-label="Kelo Care agency portal">
            <span><Image src="/images/app/kelo-wordmark.png" alt="" width={733} height={343} /></span>
            Kelo Care
          </Link>
          <Link className="ag-back" href="/">← Back to Kelo Care</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
