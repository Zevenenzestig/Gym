// Логотип: куб в кубе, углы соединены. Крутится только при наведении мыши.
(function(){
 var c=document.getElementById('logo4d'),x=c.getContext('2d'),S=40,K=12,ay=0.62,ax=0.5,hov=false,i,j,p,q;
 var E=[];for(i=0;i<8;i++)for(j=i+1;j<8;j++){var d=i^j;if(d===1||d===2||d===4)E.push([i,j])}
 function draw(){
  var cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),O=[],I=[];
  function pt(i,r){var X=(i&1?1:-1)*r,Y=(i&2?1:-1)*r,Z=(i&4?1:-1)*r,x1=X*cy+Z*sy,z1=-X*sy+Z*cy,y1=Y*cx-z1*sx;return[S/2+x1*K,S/2+y1*K]}
  for(i=0;i<8;i++){O.push(pt(i,1));I.push(pt(i,0.45))}
  function line(a,b,w,al){x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.strokeStyle='rgba(255,255,255,'+al+')';x.lineWidth=w;x.stroke()}
  x.clearRect(0,0,S,S);x.lineCap='round';x.shadowBlur=0;x.fillStyle='rgba(255,255,255,0.05)';
  for(p=0;p<3;p++)for(q=p+1;q<3;q++){var m=(1<<p)|(1<<q);for(i=0;i<8;i++)if((i&m)===0){var f=[i,i|(1<<p),i|m,i|(1<<q)];x.beginPath();x.moveTo(O[f[0]][0],O[f[0]][1]);for(j=1;j<4;j++)x.lineTo(O[f[j]][0],O[f[j]][1]);x.closePath();x.fill()}}
  x.shadowColor='rgba(255,255,255,0.7)';x.shadowBlur=4;
  E.forEach(function(e){line(O[e[0]],O[e[1]],2.8,0.3);line(O[e[0]],O[e[1]],1.4,1)});
  E.forEach(function(e){line(I[e[0]],I[e[1]],2.4,0.25);line(I[e[0]],I[e[1]],1.2,0.9)});
  for(i=0;i<8;i++){line(O[i],I[i],2.2,0.22);line(O[i],I[i],1,0.8)}
 }
 var box=c.parentNode;box.onmouseenter=function(){hov=true};box.onmouseleave=function(){hov=false};
 function tick(){if(hov){ay+=0.045;draw()}requestAnimationFrame(tick)}
 draw();tick();
})();
