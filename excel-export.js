function downloadExcel(){
  const rows=visible();
  if(!rows.length){alert('No hay registros para los filtros seleccionados.');return;}
  if(typeof XLSX==='undefined'){alert('No se pudo cargar el generador Excel. Revisa tu conexión a internet.');return;}
  const sheet=$('sheet').value,month=$('monthFilter').value,region=$('regionFilter').value,calculator=$('calculatorFilter').value;
  const exportRows=rows.map(row=>{const clean={};Object.entries(row).forEach(([key,value])=>clean[key]=value);return clean;});
  const filters=[
    {Filtro:'Estado',Valor:sheet},
    {Filtro:'Mes de recepción',Valor:month==='Todos'?'Todos':monthLabel(month)},
    {Filtro:'Región',Valor:region},
    {Filtro:'Calculista',Valor:calculator},
    {Filtro:'Total de registros',Valor:rows.length},
    {Filtro:'Fecha de generación',Valor:new Date().toLocaleString('es-CL')}
  ];
  const workbook=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook,XLSX.utils.json_to_sheet(exportRows),'Registros');
  XLSX.utils.book_append_sheet(workbook,XLSX.utils.json_to_sheet(filters),'Filtros aplicados');
  const stamp=new Date().toISOString().slice(0,10);XLSX.writeFile(workbook,`stock-reliquidaciones-${stamp}.xlsx`);
}
$('excelButton').onclick=downloadExcel;
