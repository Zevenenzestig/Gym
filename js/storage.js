// LocalStorage: данные хранятся как JSON под ключами sv_*
var DB={
 get:function(k){try{return JSON.parse(localStorage.getItem('sv_'+k))||[]}catch(e){return []}},
 set:function(k,v){try{localStorage.setItem('sv_'+k,JSON.stringify(v))}catch(e){alert('Не удалось сохранить данные (LocalStorage отключён)')}},
 id:function(){return Date.now()+Math.floor(Math.random()*1000)},
 add:function(iso,n){var d=iso?new Date(iso+'T00:00:00'):new Date();d.setDate(d.getDate()+n);var m=d.getMonth()+1,x=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(x<10?'0':'')+x},
 day:function(n){return DB.add(null,n)},
 init:function(){
  if(localStorage.getItem('sv_init'))return;
  DB.set('users',[{id:1,login:'admin',pass:'admin123',name:'Администратор',email:'admin@vertex.kz',role:'admin',sub:null},{id:2,login:'client',pass:'client123',name:'Иван Клиентов',email:'client@vertex.kz',role:'client',sub:null}]);
  var d=[['Фитнес','Анна Орлова',10,5],['Йога','Мария Светлая',20,6],['Бокс','Игорь Громов',12,7],['Кроссфит','Денис Мощный',8,8],['Плавание','Олег Волнов',15,9],['Силовые тренировки','Артём Сильнов',6,10]],w=[];
  for(var i=0;i<d.length;i++)w.push({id:i+1,cat:d[i][0],title:d[i][0],trainer:d[i][1],seats:d[i][2],date:DB.day(i%3+1),time:(d[i][3]+9)+':00',dur:60});
  DB.set('workouts',w);DB.set('bookings',[]);DB.set('notes',[]);DB.set('sales',[]);DB.set('apps',[]);localStorage.setItem('sv_init','1');
 }
};
