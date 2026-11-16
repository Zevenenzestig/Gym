// Личный кабинет клиента: данные, статус абонемента, уведомления
function renderCabinet(v){var u=Auth.user(),n=DB.get('notes').filter(function(x){return x.userId===u.id}).reverse(),act=hasSub(u),left=0;
 if(act)left=Math.round((new Date(u.sub+'T00:00:00')-new Date(DB.day(0)+'T00:00:00'))/864e5);
 v.innerHTML='<section class="wrap"><h2>'+t('Личный кабинет')+'</h2><div class="card"><h3>'+esc(u.name)+'</h3><p class="muted">'+t('Логин')+': '+esc(u.login)+' · '+esc(u.email)+'</p></div>'+
 '<div class="card" style="margin-top:16px"><span class="muted">'+t('Мой абонемент')+'</span><div class="big" style="margin:8px 0">'+t(act?'Активен':'Не активен')+'</div>'+
 (act?'<p>'+t('Абонемент активен до')+' <b>'+u.sub+'</b> · '+t('Осталось дней')+': <b>'+left+'</b></p>':'<p class="muted">'+t('Нет активного абонемента')+'</p>')+
 '<a class="btn" href="#membership">'+t(act?'Продлить абонемент':'Оформить абонемент')+'</a></div>'+
 '<h2>'+t('Уведомления')+'</h2>'+(n.map(function(x){return'<div class="card" style="margin-bottom:8px"><span class="muted">'+x.date+'</span><br>'+esc(x.text)+'</div>'}).join('')||'<p class="muted">'+t('Нет уведомлений')+'</p>')+'</section>'}
