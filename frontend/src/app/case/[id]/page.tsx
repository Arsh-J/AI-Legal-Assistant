"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { queryApi, reportApi, isLoggedIn } from "@/lib/api";
import { Aurora } from "@/components/ui/aurora";

interface IPC { section_number: string; title: string; description: string; punishment: string; fine?: string; reference_link?: string; }
interface Analysis { legal_category: string; summary: string; relevant_sections: IPC[]; possible_outcomes: string[]; precautions: string[]; recommended_actions: string[]; }
interface CaseData { query_id: number; query_text: string; analysis: Analysis; timestamp: string; }

export default function CasePage() {
  const { id }  = useParams();
  const router  = useRouter();
  const [data, setData]       = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dl, setDl]           = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return; }
    queryApi.getById(Number(id))
      .then(r => setData(r.data))
      .catch(() => { toast.error("Case not found."); router.push("/dashboard"); })
      .finally(() => setLoading(false));
  }, [id, router]);

  const download = async (format: "pdf" | "docx") => {
    setDl(format);
    try {
      const r = await reportApi.download(Number(id), format);
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement("a"); a.href = url; a.download = `lexai_report_${id}.${format}`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} downloaded.`);
    } catch { toast.error("Download failed."); }
    finally { setDl(null); }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh",background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif" }}>
      <Aurora colorStops={["#1D4ED8", "#6366F1", "#060D18"]} amplitude={1.5} blend={110} speed={1.6} opacity={0.6} />
      <div style={{ textAlign:"center" }}>
        <div style={{ width:44,height:44,border:"3px solid rgba(59,130,246,0.15)",borderTopColor:"var(--amber)",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px" }} />
        <p style={{ color:"var(--dim)",fontSize:14 }}>Opening case file...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!data) return null;
  const a = data.analysis;

  return (
    <div style={{ minHeight:"100vh",background:"var(--ink)",fontFamily:"'Syne',system-ui,sans-serif" }}>
      <Aurora colorStops={["#1D4ED8", "#6366F1", "#060D18"]} amplitude={1.5} blend={120} speed={1.4} opacity={0.6} />
      <div style={{ position:"fixed",top:0,left:0,right:0,height:220,background:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(59,130,246,0.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }} />

      <nav style={{ position:"sticky",top:0,zIndex:50,borderBottom:"1px solid var(--border)",backdropFilter:"blur(20px)",background:"rgba(6,13,24,0.82)",padding:"0 6%" }}>
        <div style={{ maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <Link href="/dashboard" style={{ color:"var(--dim)",textDecoration:"none",fontSize:13,fontWeight:600,transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--amber)"}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--dim)"}>
              ← Case Room
            </Link>
            <span style={{ color:"var(--border)" }}>|</span>
            <span style={{ fontSize:12,color:"var(--dim)" }}>Case #{data.query_id}</span>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            {([["pdf","PDF","#E05252","rgba(224,82,82,0.3)","rgba(224,82,82,0.08)"],["docx","DOCX","var(--amber)","rgba(59,130,246,0.3)","rgba(59,130,246,0.08)"]] as [string,string,string,string,string][]).map(([fmt,label,color,border,bg])=>(
              <button key={fmt} onClick={()=>download(fmt as "pdf"|"docx")} disabled={!!dl}
                style={{ display:"flex",alignItems:"center",gap:6,background:dl===fmt?bg:"transparent",border:`1px solid ${dl===fmt?border:"var(--border)"}`,color:dl===fmt?color:"var(--dim)",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:dl?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",transition:"all 0.2s" }}
                onMouseEnter={e=>{ if(!dl){const b=e.currentTarget as HTMLButtonElement;b.style.background=bg;b.style.borderColor=border;b.style.color=color;}}}
                onMouseLeave={e=>{ if(!dl){const b=e.currentTarget as HTMLButtonElement;b.style.background="transparent";b.style.borderColor="var(--border)";b.style.color="var(--dim)";}}}>{dl===fmt?"⏳":"⬇"} {label}</button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ position:"relative",zIndex:1,maxWidth:980,margin:"0 auto",padding:"36px 6% 80px" }}>
        {/* Header */}
        <div style={{ background:"var(--slate)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:16,padding:"26px 30px",marginBottom:20,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:0,right:0,width:160,height:160,background:"radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap" }}>
            <span style={{ fontSize:36,filter:"drop-shadow(0 0 10px rgba(59,130,246,0.35))" }}>⚖️</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:10 }}>
                <span style={{ background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.28)",color:"var(--amber)",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,letterSpacing:"0.5px" }}>{a.legal_category}</span>
                <span style={{ fontSize:11,color:"var(--dim)" }}>{new Date(data.timestamp).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
              </div>
              <p style={{ color:"var(--text)",fontSize:15,lineHeight:1.65,margin:0 }}>
                <span style={{ fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginRight:8 }}>Query:</span>
                {data.query_text}
              </p>
            </div>
          </div>
        </div>

        <Sec icon="📖" title="Case Summary">
          <p style={{ color:"var(--muted)",fontSize:15,lineHeight:1.8,margin:0 }}>{a.summary}</p>
        </Sec>

        <Sec icon="📜" title={`Legal Provisions (${a.relevant_sections.length})`}>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {a.relevant_sections.map((s,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 18px",transition:"border-color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(59,130,246,0.25)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)"}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10,flexWrap:"wrap" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ background:"rgba(59,130,246,0.09)",border:"1px solid rgba(59,130,246,0.22)",color:"var(--amber)",fontSize:11,fontWeight:800,padding:"3px 10px",borderRadius:6,whiteSpace:"nowrap" }}>{s.section_number}</span>
                    <span style={{ color:"var(--bright)",fontWeight:700,fontSize:14 }}>{s.title}</span>
                  </div>
                  {s.reference_link&&<a href={s.reference_link} target="_blank" rel="noopener noreferrer" style={{ fontSize:11,color:"var(--dim)",textDecoration:"none",fontWeight:600,flexShrink:0,transition:"color 0.2s" }} onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--amber)"} onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="var(--dim)"}>Indian Kanoon ↗</a>}
                </div>
                <p style={{ color:"var(--dim)",fontSize:13,lineHeight:1.65,marginBottom:10 }}>{s.description}</p>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  <span style={{ background:"rgba(224,82,82,0.07)",border:"1px solid rgba(224,82,82,0.16)",color:"#FCA5A5",fontSize:12,padding:"3px 11px",borderRadius:20 }}>⚖ {s.punishment}</span>
                  {s.fine&&<span style={{ background:"rgba(59,130,246,0.07)",border:"1px solid rgba(59,130,246,0.16)",color:"#93C5FD",fontSize:12,padding:"3px 11px",borderRadius:20 }}>💰 {s.fine}</span>}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14 }}>
          <Sec icon="🔮" title="Possible Outcomes" noBot>
            {a.possible_outcomes.map((o,i)=>(
              <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start",padding:"9px 0",borderBottom:i<a.possible_outcomes.length-1?"1px solid var(--border)":"none" }}>
                <span style={{ width:20,height:20,borderRadius:5,background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"var(--amber)",flexShrink:0,marginTop:2 }}>{i+1}</span>
                <p style={{ color:"var(--muted)",fontSize:13,lineHeight:1.65,margin:0 }}>{o}</p>
              </div>
            ))}
          </Sec>
          <Sec icon="🛡️" title="Precautions" noBot>
            {a.precautions.map((p,i)=>(
              <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start",padding:"9px 0",borderBottom:i<a.precautions.length-1?"1px solid var(--border)":"none" }}>
                <span style={{ color:"#A78BFA",fontSize:15,flexShrink:0,lineHeight:1.65 }}>●</span>
                <p style={{ color:"var(--muted)",fontSize:13,lineHeight:1.65,margin:0 }}>{p}</p>
              </div>
            ))}
          </Sec>
        </div>

        <Sec icon="✅" title="Recommended Actions">
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10 }}>
            {a.recommended_actions.map((act,i)=>(
              <div key={i} style={{ background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:10,padding:"12px 14px",display:"flex",gap:10 }}>
                <span style={{ color:"#4ADE80",fontWeight:800,fontSize:14,flexShrink:0 }}>→</span>
                <p style={{ color:"var(--muted)",fontSize:13,lineHeight:1.65,margin:0 }}>{act}</p>
              </div>
            ))}
          </div>
        </Sec>

        {/* Download */}
        <div style={{ background:"rgba(59,130,246,0.05)",border:"1px solid rgba(59,130,246,0.16)",borderRadius:16,padding:"32px",textAlign:"center" }}>
          <div style={{ fontSize:34,marginBottom:12 }}>📁</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:"var(--bright)",marginBottom:8 }}>Download Case Report</h3>
          <p style={{ color:"var(--dim)",fontSize:14,marginBottom:26 }}>Professional report with all references — share with your advocate</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>download("pdf")} disabled={!!dl} style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(224,82,82,0.85)",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:dl?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 0 16px rgba(224,82,82,0.22)",opacity:dl?0.7:1 }}>
              {dl==="pdf"?"⏳ Generating...":"⬇ Download PDF"}
            </button>
            <button onClick={()=>download("docx")} disabled={!!dl} className="btn-amber" style={{ opacity:dl?0.7:1,cursor:dl?"not-allowed":"pointer" }}>
              {dl==="docx"?"⏳ Generating...":"⬇ Download DOCX"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Sec({ icon, title, children, noBot }: { icon: string; title: string; children: React.ReactNode; noBot?: boolean }) {
  return (
    <div style={{ background:"var(--slate)",border:"1px solid var(--border)",borderRadius:14,padding:"20px 22px",marginBottom:noBot?0:14,transition:"border-color 0.25s" }}
      onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(59,130,246,0.18)"}
      onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)"}>
      <h2 style={{ fontSize:13,fontWeight:700,color:"var(--bright)",letterSpacing:"0.3px",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
        {icon} {title}
        <div style={{ flex:1,height:1,background:"var(--border)",marginLeft:6 }} />
      </h2>
      {children}
    </div>
  );
}
