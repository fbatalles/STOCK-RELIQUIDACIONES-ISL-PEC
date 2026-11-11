function refreshFilterOptions(){
  const currentSheet=$('sheet').value||'Todas';
  $('sheet').innerHTML='<option>Todas</option>'+data.sheets.map(x=>`<option>${esc(x)}</option>`).join('');
  $('sheet').value=data.sheets.includes(currentSheet)?currentSheet:'Todas';
  const scoped=data.records.filter(r=>$('sheet').value==='Todas'||sourceSheet(r)===$('sheet').value);
  const regions=[...new Set(scoped.map(r=>field(r,['region'])).filter(Boolean))].sort();
  const calculators=[...new Set(scoped.map(r=>field(r,['calculista','responsable','analista'])).filter(Boolean))].sort();
  const previousRegion=$('regionFilter').value,previousCalculator=$('calculatorFilter').value;
  $('regionFilter').innerHTML='<option>Todas</option>'+regions.map(x=>`<option>${esc(x)}</option>`).join('');
  $('calculatorFilter').innerHTML='<option>Todos</option>'+calculators.map(x=>`<option>${esc(x)}</option>`).join('');
  if(regions.includes(previousRegion))$('regionFilter').value=previousRegion;
  if(calculators.includes(previousCalculator))$('calculatorFilter').value=previousCalculator;
  const managed=normalizeText($('sheet').value)==='reliquidacionesgestionadas';
  $('calculatorFilterLabel').style.display=managed?'block':'none';
}
function visible(){const sheet=$('sheet').value,region=$('regionFilter').value,calculator=$('calculatorFilter').value,q=$('search').value.toLowerCase();return data.records.filter(r=>(sheet==='Todas'||sourceSheet(r)===sheet)&&(region==='Todas'||field(r,['region'])===region)&&(calculator==='Todos'||field(r,['calculista','responsable','analista'])===calculator)&&(!q||Object.values(r).some(v=>String(v).toLowerCase().includes(q))));}
function render(){const rows=visible();$('total').textContent=rows.length.toLocaleString('es-CL');$('sheets').textContent=data.sheets.length;$('updated').textContent=data.updatedAt?new Date(data.updatedAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}):'—';const counts={};rows.forEach(r=>{const s=sourceSheet(r)||'Sin pestaña';counts[s]=(counts[s]||0)+1;});const max=Math.max(...Object.values(counts),1);$('bars').innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,n])=>`<div class="bar"><span>${esc(name)}</span><div class="track"><div class="fill" style="width:${n/max*100}%"></div></div><b>${n}</b></div>`).join('')||'<p>Sin datos</p>';renderManagedAnalytics(rows,$('sheet').value);}
function preparePdf(){const sheet=$('sheet').value==='Todas'?'Todos los estados':$('sheet').value;document.title=`Stock Reliquidaciones ISL-PEC - ${sheet}`;window.print();setTimeout(()=>{document.title='Stock Reliquidaciones ISL-PEC';},1000);}
$('sheet').onchange=()=>{refreshFilterOptions();render();};$('regionFilter').onchange=render;$('calculatorFilter').onchange=render;$('search').oninput=render;$('pdfButton').onclick=preparePdf;refreshFilterOptions();render();
