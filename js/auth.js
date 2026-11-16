// Регистрация, вход, выход. Демо-защита: пароли в LocalStorage НЕ безопасны.
var Auth={
 user:function(){var id=parseInt(localStorage.getItem('sv_session'),10);return id?byId(DB.get('users'),id):null},
 logout:function(){localStorage.removeItem('sv_session');toast(t('Вы вышли из аккаунта'));location.hash='#home';route()}
};
// Правила пароля (индикаторы обновляются при вводе)
var PRULES=[['Минимум 8 символов',function(p){return p.length>=8}],['Заглавная латинская буква',function(p){return /[A-Z]/.test(p)}],['Цифра',function(p){return /[0-9]/.test(p)}],['Спецсимвол (! @ # $ %)',function(p){return /[^A-Za-zА-Яа-яЁё0-9\s]/.test(p)}]];
function passOk(p){return PRULES.every(function(r){return r[1](p)})}
function checkPass(p){return passOk(p)?'':t('Пароль не соответствует требованиям')}
function passLive(){var p=$('a_pass').value;PRULES.forEach(function(r,i){$('pr'+i).className='dot'+(r[1](p)?' ok':'')});$('a_btn').disabled=!passOk(p)}
function formHtml(reg){return '<div class="wrap"><div class="form"><h2>'+t(reg?'Регистрация':'Вход')+'</h2>'+
 (reg?'<label>'+t('Имя')+'</label><input id="a_name"><label>Email</label><input id="a_mail">':'')+
 '<label>'+t('Логин')+'</label><input id="a_login"><label>'+t('Пароль')+'</label><input id="a_pass" type="password"'+(reg?' oninput="passLive()"':'')+'>'+(reg?'<ul class="prules">'+PRULES.map(function(r,i){return'<li><i id="pr'+i+'" class="dot"></i>'+t(r[0])+'</li>'}).join('')+'</ul>':'')+
 '<p id="a_err" style="color:#ccc"></p><button class="btn" id="a_btn" '+(reg?'disabled ':'')+'onclick="'+(reg?'doRegister()':'doLogin()')+'">'+t(reg?'Создать аккаунт':'Войти')+'</button>'+
 (reg?'':'<p class="muted">Demo: admin/admin123, client/client123</p>')+'</div></div>'}
function renderLogin(v){v.innerHTML=formHtml(false)}
function renderRegister(v){v.innerHTML=formHtml(true)}
function doLogin(){var l=$('a_login').value.trim(),p=$('a_pass').value,us=DB.get('users');
 for(var i=0;i<us.length;i++)if(us[i].login===l&&us[i].pass===p){localStorage.setItem('sv_session',us[i].id);toast(t('Добро пожаловать')+', '+us[i].name);location.hash=us[i].role==='admin'?'#admin':'#cabinet';route();return}
 $('a_err').textContent=t('Неверный логин или пароль')}
function doRegister(){var n=$('a_name').value.trim(),m=$('a_mail').value.trim(),l=$('a_login').value.trim(),p=$('a_pass').value,us=DB.get('users'),e=$('a_err');
 if(!n||!m||!l||!p)return e.textContent=t('Заполните все поля');
 if(!/^\S+@\S+\.\S+$/.test(m))return e.textContent=t('Некорректный email');
 if(l.length<3)return e.textContent=t('Логин от 3 символов');
 var pe=checkPass(p);if(pe)return e.textContent=pe;
 for(var i=0;i<us.length;i++)if(us[i].login===l)return e.textContent=t('Такой логин уже занят');
 var u={id:DB.id(),login:l,pass:p,name:n,email:m,role:'client',sub:null};us.push(u);DB.set('users',us);localStorage.setItem('sv_session',u.id);toast(t('Регистрация успешна'));location.hash='#cabinet';route()}
