// Панель администратора: статистика, пользователи, отчёты, отклики
var AT='dash';
function renderAdmin(v){var t2=[['dash','Панель'],['users','Пользователи'],['rep','Отчёты'],['apps','Отклики']];
 v.innerHTML='<section class="wrap"><h2>Администрирование</h2><div class="tabs">'+t2.map(function(x){return'<button class="'+(AT===x[0]?'on':'')+'" onclick="AT=\''+x[0]+'\';renderAdmin($(\'app\'))">'+x[1]+'</button>'}).join('')+'</div><div id="ab" class="card"></div></section>';
 ({dash:tabDash,users:tabUsers,rep:tabRep,apps:tabApps})[AT]($('ab'))}
function searchBox(){return'<input placeholder="Поиск..." oninput="var q=this.value.toLowerCase();var r=document.querySelectorAll(\'#ab tr.d\');for(var i=0;i<r.length;i++)r[i].style.display=r[i].textContent.toLowerCase().indexOf(q)<0?\'none\':\'\'" style="max-width:300px">'}
function tabDash(e){var us=DB.get('users'),cl=0,act=0,sum=0,s=DB.get('sales');us.forEach(function(u){if(u.role==='client'){cl++;if(hasSub(u))act++}});s.forEach(function(x){sum+=x.amount});
 function c(n,l){return'<div class="card"><div class="big">'+n+'</div>'+l+'</div>'}
 e.innerHTML='<div class="grid">'+c(cl,'Клиентов')+c(act,'Активных абонементов')+c(s.length,'Продаж абонементов')+c(fmt(sum),'Доход')+c(DB.get('apps').length,'Откликов на вакансии')+'</div>'}
function tabUsers(e){var us=DB.get('users');
 e.innerHTML='<button class="btn" onclick="editUser()">+ Добавить</button>'+searchBox()+'<table><tr><th>Логин</th><th>Имя</th><th>Email</th><th>Роль</th><th>Абонемент до</th><th></th></tr>'+us.map(function(u){return'<tr class="d"><td>'+esc(u.login)+'</td><td>'+esc(u.name)+'</td><td>'+esc(u.email)+'</td><td>'+u.role+'</td><td>'+(u.sub||'—')+'</td><td><button class="btn sm" onclick="editUser('+u.id+')">Изменить</button><button class="btn sm ghost" onclick="delUser('+u.id+')">Удалить</button></td></tr>'}).join('')+'</table>'}
function editUser(id){var us=DB.get('users'),u=id?byId(us,id):null;
 modal(u?'Изменить пользователя':'Новый пользователь',[{k:'login',l:'Логин'},{k:'name',l:'Имя'},{k:'email',l:'Email'},{k:'pass',l:'Пароль'},{k:'role',l:'Роль',o:['client','admin']},{k:'sub',l:'Абонемент до (ГГГГ-ММ-ДД, можно пусто)'}],u,function(r){
  if(!r.login||!r.name||!r.email||!r.pass)return'Заполните все поля';
  if((!u||r.pass!==u.pass)&&checkPass(r.pass))return checkPass(r.pass);
  if(r.sub&&!/^\d{4}-\d\d-\d\d$/.test(r.sub))return'Дата абонемента: ГГГГ-ММ-ДД';
  for(var i=0;i<us.length;i++)if(us[i].login===r.login&&(!u||us[i].id!==u.id))return'Логин занят';
  r.sub=r.sub||null;if(u){for(var k in r)u[k]=r[k]}else{r.id=DB.id();us.push(r)}DB.set('users',us);toast('Пользователь сохранён');renderAdmin($('app'));return''})}
function delUser(id){if(Auth.user().id===id)return toast('Нельзя удалить себя','err');if(!confirm('Удалить пользователя?'))return;
 DB.set('users',DB.get('users').filter(function(u){return u.id!==id}));toast('Пользователь удалён');renderAdmin($('app'))}
function tabApps(e){var a=DB.get('apps').reverse();e.innerHTML=searchBox()+'<table><tr><th>Вакансия</th><th>Имя</th><th>Телефон</th><th>Сообщение</th><th>Дата</th></tr>'+(a.map(function(x){return'<tr class="d"><td>'+esc(x.job)+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.phone)+'</td><td>'+esc(x.msg)+'</td><td>'+x.date+'</td></tr>'}).join('')||'<tr><td colspan="5" class="muted">Откликов нет</td></tr>')+'</table>'}
