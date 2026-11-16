// Отчёт по продажам абонементов за период
function tabRep(e){e.innerHTML='<label>С</label><input type="date" id="r1" style="max-width:200px"><label>По</label><input type="date" id="r2" style="max-width:200px"><button class="btn" onclick="makeReport()">Сформировать отчёт</button><button class="btn ghost" onclick="exportSales()">Скачать CSV</button><div id="rr"></div>';makeReport()}
function salesInRange(){var a=$('r1').value,z=$('r2').value,us=DB.get('users');
 return DB.get('sales').filter(function(x){return(!a||x.date>=a)&&(!z||x.date<=z)}).map(function(x){var u=byId(us,x.userId)||{name:'(удалён)'};return{name:u.name,months:x.months,amount:x.amount,date:x.date}})}
function makeReport(){var s=salesInRange(),sum=0,by={};s.forEach(function(x){sum+=x.amount;by[x.months]=(by[x.months]||0)+1});
 var top=Object.keys(by).sort(function(a,b){return by[b]-by[a]});
 $('rr').innerHTML='<div class="grid" style="margin-top:14px"><div class="card"><div class="big">'+s.length+'</div>Продаж</div><div class="card"><div class="big">'+fmt(sum)+'</div>Доход</div></div><h3>Популярные абонементы</h3><table><tr><th>Срок</th><th>Продаж</th></tr>'+(top.map(function(m){return'<tr><td>'+m+' мес.</td><td>'+by[m]+'</td></tr>'}).join('')||'<tr><td colspan="2" class="muted">Нет данных</td></tr>')+'</table><h3>Продажи</h3><table><tr><th>Клиент</th><th>Срок</th><th>Сумма</th><th>Дата</th></tr>'+(s.map(function(x){return'<tr><td>'+esc(x.name)+'</td><td>'+x.months+' мес.</td><td>'+fmt(x.amount)+'</td><td>'+x.date+'</td></tr>'}).join('')||'<tr><td colspan="4" class="muted">Нет продаж</td></tr>')+'</table>'}
// CSV с BOM: Excel корректно показывает кириллицу
function exportSales(){var rows=[['Клиент','Срок (мес.)','Сумма','Дата']].concat(salesInRange().map(function(x){return[x.name,x.months,x.amount,x.date]}));
 var csv='\ufeff'+rows.map(function(r){return r.map(function(c){return'"'+String(c).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='prodazhi.csv';document.body.appendChild(a);a.click();document.body.removeChild(a)}
