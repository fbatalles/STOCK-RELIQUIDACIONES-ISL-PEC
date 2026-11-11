function renderWithAssigned(){
  render();
  const selected=normalizeText($('sheet').value),card=$('assignedKpi');
  if(selected!=='reliquidacionespendientes'){card.hidden=true;return;}
  const assigned=visible().filter(row=>String(field(row,['fecha asignacion','asignacion'])||'').trim()!=='').length;
  card.hidden=false;$('assignedCount').textContent=assigned.toLocaleString('es-CL');
}
$('sheet').onchange=()=>{refreshFilterOptions();renderWithAssigned();};$('monthFilter').onchange=renderWithAssigned;$('regionFilter').onchange=renderWithAssigned;$('calculatorFilter').onchange=renderWithAssigned;$('search').oninput=renderWithAssigned;renderWithAssigned();
