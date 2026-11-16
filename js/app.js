// Общие функции, навигация, главная, абонемент, вакансии, маршрутизация
var DIRS=[['Фитнес','fitness'],['Йога','yoga'],['Бокс','boxing'],['Кроссфит','crossfit'],['Плавание','swimming'],['Силовые тренировки','strength']];
function $(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function toast(m,x){var e=document.createElement('div');e.className='toast '+(x||'');e.textContent=m;$('toasts').appendChild(e);setTimeout(function(){e.parentNode&&e.parentNode.removeChild(e)},3500)}
function notify(uid,text){var n=DB.get('notes');n.push({id:DB.id(),userId:uid,text:text,date:new Date().toLocaleString('ru-RU')});DB.set('notes',n)}
function freeSeats(w){var c=0,b=DB.get('bookings');for(var i=0;i<b.length;i++)if(b[i].workoutId===w.id&&b[i].status==='Подтверждена')c++;return w.seats-c}
function byId(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null}
function hasSub(u){return !!(u&&u.sub&&u.sub>=DB.day(0))}
// Окно с формой: fields=[{k,l,t,o}], onSave(values) возвращает текст ошибки или ''
function modal(title,fields,vals,onSave){
 var h='<div class="ov"><div class="form"><h3>'+esc(title)+'</h3>';
 fields.forEach(function(f){var v=vals&&vals[f.k]!==undefined?vals[f.k]:'';h+='<label>'+f.l+'</label>';
  if(f.o)h+='<select id="m_'+f.k+'">'+f.o.map(function(o){return'<option'+(o===v?' selected':'')+'>'+o+'</option>'}).join('')+'</select>';
  else h+='<input id="m_'+f.k+'" type="'+(f.t||'text')+'" value="'+esc(v)+'">'});
 h+='<p id="m_err" style="color:#ccc"></p><button class="btn" id="m_ok">'+t('Сохранить')+'</button><button class="btn ghost" id="m_no">'+t('Отмена')+'</button></div></div>';
 $('mod').innerHTML=h;$('m_no').onclick=function(){$('mod').innerHTML=''};
 $('m_ok').onclick=function(){var r={};fields.forEach(function(f){r[f.k]=$('m_'+f.k).value.trim()});var e=onSave(r);if(e)$('m_err').textContent=e;else $('mod').innerHTML=''};
}
function setMenu(o){$('nav').classList[o?'add':'remove']('open');$('burger').classList[o?'add':'remove']('open')}
function toggleMenu(){setMenu(!$('nav').classList.contains('open'))}
document.addEventListener('click',function(e){if(!$('nav').contains(e.target)&&!$('burger').contains(e.target))setMenu(false)});
function nav(){var u=Auth.user(),h='<a href="#home">'+t('Главная')+'</a><a href="#membership">'+t('Абонемент')+'</a><a href="#jobs">'+t('Вакансии')+'</a>';
 if(!u)h+='<a href="#login">'+t('Вход')+'</a><a href="#register">'+t('Регистрация')+'</a>';
 else{h+=u.role==='admin'?'<a href="#admin">Админ-панель</a>':'<a href="#cabinet">'+t('Кабинет')+'</a>';h+='<button onclick="Auth.logout()">'+t('Выйти')+' ('+esc(u.login)+')</button>'}
 h+='<div class="lang">'+['ru','kk','en'].map(function(l){return'<button class="'+(l===L?'on':'')+'" onclick="setLang(\''+l+'\')">'+(l==='kk'?'KZ':l.toUpperCase())+'</button>'}).join('')+'</div>';$('nav').innerHTML=h}
function Home(v){var adv=['Один абонемент на всё','Опытные тренеры','Современное оборудование','Онлайн-запись'];
 v.innerHTML='<div class="hero page"><div class="promo">'+t('АКЦИЯ: −25% на годовой абонемент до конца месяца')+'</div><h1>'+t('ТРЕНИРУЙСЯ БЕЗ ГРАНИЦ')+'</h1><p>'+t('Один абонемент — все направления клуба.')+'</p><div><a class="btn" href="#membership">'+t('Оформить абонемент')+'</a></div></div>'+
 '<section class="band sports page"><div class="wrap"><h2>'+t('Направления')+'</h2><div class="grid">'+DIRS.map(function(c){return'<a class="card dir" href="#membership"><img src="images/'+c[1]+'.jpg" alt="" onerror="this.style.display=\'none\'"><h3>'+t(c[0])+'</h3></a>'}).join('')+'</div></div></section>'+
 '<section class="wrap page adv"><h2>'+t('Преимущества')+'</h2><div class="grid">'+adv.map(function(a){return'<div class="card"><h3>'+t(a)+'</h3></div>'}).join('')+'</div></section>'+
 '<section class="band cta page"><div class="wrap"><h2 style="display:inline-block">'+t('Единый абонемент')+'</h2><p class="muted">'+t('Один абонемент — все направления клуба.')+'</p><a class="btn" href="#membership">'+t('Оформить абонемент')+'</a></div></section>'}
// Единый абонемент: цены видны только после входа
var PLANS=[{m:1,d:30,p:18000},{m:3,d:90,p:48000},{m:12,d:365,p:192000,off:0.25}];
function price(p){return Math.round(p.p*(1-(p.off||0)))}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' ₸'}
function Membership(v){var u=Auth.user(),h='<section class="wrap"><h2>'+t('Единый абонемент')+'</h2><p class="muted">'+t('Один абонемент даёт доступ ко всем направлениям и записи на любые тренировки.')+'</p>';
 if(!u)h+='<div class="card"><p>'+t('Цены и оформление абонемента доступны после входа в аккаунт')+'</p><a class="btn" href="#login">'+t('Вход')+'</a><a class="btn ghost" href="#register">'+t('Регистрация')+'</a></div>';
 else h+='<p>'+(hasSub(u)?t('Абонемент активен до')+' <b>'+u.sub+'</b>':t('Нет активного абонемента'))+'</p><div class="grid">'+PLANS.map(function(p,i){return'<div class="card">'+(p.off?'<span class="st">−25%</span>':'')+'<div class="big">'+p.m+' '+t('мес.')+'</div><p>'+(p.off?'<s class="muted">'+fmt(p.p)+'</s> ':'')+'<b>'+fmt(price(p))+'</b></p><button class="btn" onclick="buyPlan('+i+')">'+t('Купить')+'</button></div>'}).join('')+'</div>';
 v.innerHTML=h+'</section>'}
// Покупка (демо-оплата): продлевает абонемент и пишет продажу
function buyPlan(i){var u=Auth.user(),p=PLANS[i];if(u.role!=='client')return toast(t('Только для клиентов'),'err');if(!confirm(t('Оплатить')+' '+fmt(price(p))+'?'))return;
 var us=DB.get('users'),x=byId(us,u.id),today=DB.day(0);x.sub=DB.add(x.sub&&x.sub>today?x.sub:today,p.d);DB.set('users',us);
 var s=DB.get('sales');s.push({id:DB.id(),userId:u.id,months:p.m,amount:price(p),date:today});DB.set('sales',s);notify(u.id,t('Абонемент оформлен!')+' '+x.sub);toast(t('Абонемент оформлен!'));Membership($('app'))}
var JOBS=[['Тренер групповых программ','Проведение групповых занятий, опыт от 1 года'],['Администратор клуба','Работа с клиентами, сменный график'],['Тренер тренажёрного зала','Персональные и малые группы, сертификат обязателен'],['Менеджер по продажам','Продажа абонементов, коммуникабельность']];
function Jobs(v){v.innerHTML='<section class="wrap"><h2>'+t('Вакансии')+'</h2><p class="muted">'+t('Присоединяйтесь к команде VERTEX')+'</p><div class="grid">'+JOBS.map(function(j,i){return'<div class="card"><h3>'+t(j[0])+'</h3><p class="muted">'+t(j[1])+'</p><button class="btn" onclick="applyJob('+i+')">'+t('Откликнуться')+'</button></div>'}).join('')+'</div></section>'}
function applyJob(i){modal(t(JOBS[i][0]),[{k:'name',l:t('Имя')},{k:'phone',l:t('Телефон')},{k:'msg',l:t('Сообщение')}],null,function(r){
 if(!r.name||!r.phone)return t('Заполните имя и телефон');var a=DB.get('apps');a.push({id:DB.id(),job:JOBS[i][0],name:r.name,phone:r.phone,msg:r.msg,date:new Date().toLocaleString('ru-RU')});DB.set('apps',a);toast(t('Отклик отправлен'));return''})}
function route(){var h=(location.hash||'#home').slice(1),u=Auth.user();
 if(h==='cabinet'&&!u)h='login';
 if(h==='admin'&&(!u||u.role!=='admin')){toast(t('Вход'),'err');h=u?'home':'login'}
 nav();setMenu(false);$('foot').textContent='© VERTEX. '+t('Демо-проект: данные хранятся в LocalStorage.');
 var m={home:Home,login:renderLogin,register:renderRegister,cabinet:renderCabinet,admin:renderAdmin,membership:Membership,jobs:Jobs};(m[h]||Home)($('app'));window.scrollTo(0,0)}
window.onhashchange=route;
