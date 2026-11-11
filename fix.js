// Compatibilidad del campo de origen y render posterior a la carga inicial.
function sourceSheet(row){const key=Object.keys(row).find(k=>normalizeText(k)==='hoja'||normalizeText(k)==='pestana');return key?row[key]:'';}
function visible(){const sheet=$('sheet').value,q=$('search').value.toLowerCase();return data.records.filter(r=>(sheet==='Todas'||sourceSheet(r)===sheet)&&(!q||Object.values(r).some(v=>String(v).toLowerCase().includes(q))));}
function render(){const rows=visible(),keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];$('total').textContent=rows.length.toLocaleString('es-CL');$('sheets').textContent=data.sheets.length;$('states').textContent=new Set(rows.map(r=>r.estado||r.status).filter(Boolean)).size;$('updated').textContent=data.updatedAt?new Date(data.updatedAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}):'—';$('count').textContent=`${rows.length} registros`;$('thead').innerHTML='<tr>'+keys.map(k=>`<th>${esc(k)}</th>`).join('')+'</tr>';$('tbody').innerHTML=rows.slice(0,200).map(r=>'<tr>'+keys.map(k=>`<td>${esc(r[k])}</td>`).join('')+'</tr>').join('')||'<tr><td>Sin registros</td></tr>';const counts={};rows.forEach(r=>{const s=sourceSheet(r)||'Sin pestaña';counts[s]=(counts[s]||0)+1;});const max=Math.max(...Object.values(counts),1);$('bars').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,n])=>`<div class="bar"><span>${esc(name)}</span><div class="track"><div class="fill" style="width:${n/max*100}%"></div></div><b>${n}</b></div>`).join('')||'<p>Sin datos</p>';renderManagedAnalytics(rows,$('sheet').value);}
render();

// Fechas robustas: acepta dd-mm-aaaa, dd/mm/aaaa, aaaa-mm-dd y seriales de Sheets.
function parseDate(value){
  if(value===null||value===undefined||String(value).trim()==='')return null;
  const raw=String(value).trim();
  if(/^\d+(\.\d+)?$/.test(raw)){const serial=Number(raw);if(serial>20000&&serial<80000)return new Date(Date.UTC(1899,11,30)+serial*86400000);}
  const clean=raw.split(/[T\s]/)[0].replace(/[.]/g,'/');
  let match=clean.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  let year,month,day;
  if(match){year=Number(match[1]);month=Number(match[2]);day=Number(match[3]);}
  else {match=clean.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(!match)return null;day=Number(match[1]);month=Number(match[2]);year=Number(match[3]);}
  if(year<2000||year>2100||month<1||month>12||day<1||day>31)return null;
  const date=new Date(Date.UTC(year,month-1,day));
  return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?date:null;
}
function renderManagedAnalytics(rows, selected){
  const box=$('managedAnalytics');if(normalizeText(selected)!=='reliquidacionesgestionadas'){box.hidden=true;return;}box.hidden=false;$('managedCount').textContent=`${rows.length} registros analizados`;
  renderStatsBars('regionChart',countBy(rows,['region']));renderStatsBars('calculatorChart',countBy(rows,['calculista','responsable','analista']));renderPie('reasonChart',countBy(rows,['motivo','causal','razon']));renderPie('qualityChart',countBy(rows,['calidad del trabajador','calidad trabajador','calidad']));
  const elapsed=rows.map(r=>{const start=parseDate(field(r,['fecha asignacion','asignacion'])),end=parseDate(field(r,['fecha reliquidacion','fecha revision','reliquidacion revision','revision']));if(!start||!end)return null;const days=Math.round((end-start)/86400000);return days>=0&&days<=3650?days:null;}).filter(v=>v!==null);
  const sorted=[...elapsed].sort((a,b)=>a-b),avg=elapsed.length?elapsed.reduce((a,b)=>a+b,0)/elapsed.length:0,med=sorted.length?sorted[Math.floor(sorted.length/2)]:0;$('avgElapsed').textContent=elapsed.length?`${avg.toFixed(1)} d`:'—';$('medianElapsed').textContent=elapsed.length?`${med} d`:'—';$('timingNote').textContent=elapsed.length?`Calculado en ${elapsed.length} registros válidos. Se excluyeron fechas vacías, invertidas o fuera de rango.`:'No se encontraron fechas válidas.';
}
