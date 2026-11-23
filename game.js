const c=document.getElementById('game'),x=c.getContext('2d');let W,H,DPR;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*DPR;c.height=H*DPR;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(DPR,0,0,DPR,0,0)}addEventListener('resize',resize);resize();
const keys={};addEventListener('keydown',e=>{keys[e.key.toLower?e.key.toLower():e.key]=true;if(e.key===' ')e.prevent();});addEventListener('keyup',e=>keys[e.key.toLower?e.key.toLower():e.key]=false);
let cam=0,time=0,shake=0,hp=100,bossHp=100,hitFlash=0;
const player={x:520,y:440,vx:0,vy:0,w:34,h:54,on:false,facing:1,anim:0};
const platforms=[{x:-300,y:590,w:1800,h:140},{x:190,y:520,w:180,h:18},{x:430,y:430,w:150,h:18},{x:760,y:350,w:200,h:18},{x:1010,y:480,w:180,h:18},{x:1240,y:540,w:180,h:18},{x:1500,y:450,w:220,h:18}];
const mushrooms=[{x:315,y:495},{x:650,y:565},{x:900,y:325},{x:1080,y:455},{x:1380,y:515},{x:1600,y:425}];
const enemies=[{x:820,y:540,base:820,r:28,hp:60,dead:false},{x:1120,y:455,base:1120,r:20,hp:35,dead:false},{x:1450,y:425,base:1450,r:20,hp:35,dead:false}];
const particles=[];let slash=[];
function groundYAt(px){for(const p of platforms)if(px>p.x&&px<p.x+p.w&&p.y>360)return p.y;return 590}
function rect(px,py,w,h,r=8){x.beginPath();x.roundRect(px,py,w,h,r);x.fill()}
function rr(px,py,w,h,r=8){x.beginPath();x.roundRect(px,py,w,h,r);x.fill()}
function spawn(xp,yp,n=12,color='#aefbff'){for(let i=0;i<n;i++)particles.push({x:xp,y:yp,vx:(Math.random()-0.5)*7,vy:(Math.random()-.8)*6,life:30+Math.random()*25,c:color,s:2+Math.random()*4})}
function attack(){slash.push({x:player.x+player.facing*38,y:player.y+10,life:16,f:player.facing});spawn(player.x+player.facing*45,player.y+10,10,'#fff6a8');for(const e of enemies)if(!e.dead&&Math.abs(e.x-player.x)<90&&Math.abs(e.y-player.y)<60){e.hp-=18;spawn(e.x,e.y,12,'#ff91a8');if(e.hp<=0){e.dead=true;spawn(e.x,e.y,30,'#f5df70')}}if(Math.abs(820-player.x)<95&&!document.hidden){}
}
addEventListener('mousedown',e=>attack());
addEventListener('keydown',e=>{if(e.key==='j'||e.key==='J')attack();if(e.key==='k'||e.key==='K'){slash.push({x:player.x,y:player.y,life:28,f:player.facing,spin:true});spawn(player.x,player.y,28,'#79eaff');shake=7}});
function update(){time++;const left=keys.a||keys.arrowleft,right=keys.d||keys.arrowright;if(left){player.vx-=.55;player.facing=-1}if(right){player.vx+=.55;player.facing=1}player.vx*=.82;player.vx=Math.max(-7,Math.min(7,player.vx));if((keys[' ']||keys.w||keys.arrowup)&&player.on){player.vy=-13;player.on=false}player.vy+=.65;player.x+=player.vx;player.y+=player.vy;player.on=false;
for(const p of platforms){if(player.x+16>p.x&&player.x-16<p.x+p.w&&player.y+player.h/2>=p.y&&player.y+player.h/2<=p.y+18&&player.vy>=0){player.y=p.y-player.h/2;player.vy=0;player.on=true}}
player.x=Math.max(-250,Math.min(1750,player.x));if(player.y>700){player.x=520;player.y=430;player.vy=0;hp-=10}
for(const m of mushrooms)if(!m.got&&Math.abs(m.x-player.x)<28&&Math.abs(m.y-player.y)<55){m.got=true;spawn(m.x,m.y,20,'#baff85');document.getElementById('toast').style.display='block';document.getElementById('toast').textContent='Moonshroom collected  ✦';setTimeout(()=>document.getElementById('toast').style.display='none',1300)}
for(const e of enemies)if(!e.dead){e.x=e.base+Math.sin(time*.025+e.base)*35;if(Math.abs(e.x-player.x)<35&&Math.abs(e.y-player.y)<45){hp-=.25}}
for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life--}for(let i=particles.length-1;i>=0;i--)if(particles[i].life<=0)particles.splice(i,1);for(const s of slash)s.life--;slash=slash.filter(s=>s.life>0);if(shake>0)shake*=.75;hitFlash*=.9;
cam+=(player.x-cam-W*.42)*.08
}
function tree(tx,ty,s=1){x.save();x.translate(tx,ty);x.scale(s,s);x.fillStyle='#234b32';x.beginPath();x.moveTo(-10,35);x.lineTo(-22,-30);x.lineTo(-8,-95);x.lineTo(8,-95);x.lineTo(24,-28);x.lineTo(12,35);x.fill();x.fillStyle='#1c7047';for(let i=0;i<7;i++){let a=i*.9;x.beginPath();x.ellipse(Math.cos(a)*38,Math.sin(a*.7)*18-90,42,58,.2,0,7);x.fill()}x.fillStyle='#55a85c';for(let i=0;i<5;i++){x.beginPath();x.arc(-28+i*15,-105+Math.sin(i)*18,22,0,7);x.fill()}x.restore()}
function island(px,py,w){x.fillStyle='#4c3d63';rr(px,py,w,70,18);x.fillStyle='#66b36e';rr(px,py,w,16,8);x.fillStyle='#31573e';for(let i=20;i<w;i+=55){x.beginPath();x.moveTo(px+i,py+12);x.lineTo(px+i-18,py+55);x.lineTo(px+i+22,py+55);x.fill()}}
function drawBackground(){let sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#182b62');sky.addColorStop(.55,'#5b7cc1');sky.addColorStop(1,'#acd39c');x.fillStyle=sky;x.fillRect(0,0,W,H);
// moon
x.fillStyle='#d8f1cb';x.beginPath();x.arc(W-145-cam*.02,105,38,0,7);x.fill();x.fillStyle='#a6c8bd';x.beginPath();x.arc(W-145-cam*.02,105,31,0,7);x.fill();x.fillStyle='#d8f1cb';x.beginPath();x.arc(W-132-cam*.02,96,31,0,7);x.fill();
// mountains
for(let k=0;k<3;k++){x.fillStyle=['#556fa2','#5d72a5','#7185a9'][k];x.beginPath();x.moveTo(-200-cam*.08*(k+1),H*.76);for(let i=-200;i<W+300;i+=180)x.lineTo(i,H*.76-Math.abs(Math.sin(i*.012+k))*170);x.lineTo(W+300,H);x.lineTo(-200,H);x.fill()}
// floating islands
island(180-cam*.18,230,180);island(620-cam*.18,180,130);island(1050-cam*.18,240,210);island(1430-cam*.18,150,150);
// distant trees
for(let i=-600;i<2200;i+=90){tree(i-cam*.45,570,1-(i%3)*.12)}
}
function mushroom(m){if(m.got)return;x.save();x.translate(m.x-cam,m.y);x.fillStyle='#f1ffe8';x.fillRect(-3,-18,6,20);x.fillStyle='#d86ea5';x.beginPath();x.ellipse(0,-20,19,10,0,Math.PI,0);x.fill();x.fillStyle='#76bde2';x.beginPath();x.arc(-7,-23,3,0,7);x.arc(7,-21,2,0,7);x.fill();x.restore()}
function enemyDraw(e){if(e.dead)return;x.save();x.translate(e.x-cam,e.y);x.fillStyle='#654c7d';x.beginPath();x.ellipse(0,8,28,20,0,0,7);x.fill();x.fillStyle='#a7c879';x.beginPath();x.arc(-12,-12,15,0,7);x.arc(12,-12,15,0,7);x.fill();x.fillStyle='#e7cf70';x.beginPath();x.arc(-11,-15,4,0,7);x.arc(11,-15,4,0,7);x.fill();x.restore()}
function drawPlayer(){x.save();x.translate(player.x-cam,player.y);x.scale(player.facing,1);x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(0,27,24,7,0,0,7);x.fill();
// cape
x.fillStyle='#675fe0';x.beginPath();x.moveTo(-8,-12);x.quadraticCurveTo(-28,10,-20,25);x.lineTo(4,20);x.fill();
// legs
x.fillStyle='#3e486c';rr(-13,10,10,19,4);rr(3,10,10,19,4);x.fillStyle='#e0b47c';x.fillRect(-14,25,12,5);x.fillRect(2,25,12,5);
// body
x.fillStyle='#2e7894';x.beginPath();x.moveTo(-16,-8);x.quadraticCurveTo(0,-18,16,-8);x.lineTo(12,15);x.lineTo(-12,15);x.fill();x.fillStyle='#92e0d1';x.fillRect(-10,-4,20,5);
// head
x.fillStyle='#efb98d';x.beginPath();x.arc(0,-20,14,0,7);x.fill();x.fillStyle='#765173';x.beginPath();x.moveTo(-15,-22);x.quadraticCurveTo(-12,-40,10,-38);x.quadraticCurveTo(19,-26,12,-16);x.quadraticCurveTo(5,-32,-15,-22);x.fill();x.fillStyle='#2b3557';x.beginPath();x.arc(5,-21,2,0,7);x.fill();
// sword
x.save();x.translate(14,1);x.rotate(-.35);x.fillStyle='#dfefff';rr(-3,-26,6,38,3);x.fillStyle='#6db8ff';x.beginPath();x.moveTo(-3,-26);x.lineTo(3,-26);x.lineTo(0,-38);x.fill();x.restore();x.restore();
}
function render(){update();x.save();if(shake){x.translate((Math.random-.5)*shake,(Math.random-.5)*shake)}drawBackground();x.fillStyle='rgba(44,36,70,.25)';for(let i=-300;i<1800;i+=170)x.fillRect(i-cam*.7,430+(i%3)*35,7,180);
// platforms
for(const p of platforms){island(p.x-cam,p.y,p.w)}
// ladders/rope
x.strokeStyle='#9e7a55';x.lineWidth=5;x.beginPath();x.moveTo(390-cam,590);x.lineTo(390-cam,430);x.moveTo(720-cam,590);x.lineTo(720-cam,350);x.stroke();x.lineWidth=3;for(let y=440;y<590;y+=22){x.beginPath();x.moveTo(382-cam,y);x.lineTo(398-cam,y);x.stroke()}
for(const m of mushrooms)mushroom(m);for(const e of enemies)enemyDraw(e);drawPlayer();
for(const s of slash){x.save();x.translate(s.x-cam,s.y);x.rotate(s.f*-.5);x.globalAlpha=s.life/16;x.strokeStyle=s.spin?'#79efff':'#fff7a0';x.lineWidth=s.spin?8:5;x.beginPath();x.arc(0,0,s.spin?55:42,-1.2,1.2);x.stroke();x.restore()}
for(const p of particles){x.globalAlpha=Math.min(1,p.life/20);x.fillStyle=p.c;x.beginPath();x.arc(p.x-cam,p.y,p.s,0,7);x.fill()}x.globalAlpha=1;
// foreground leaves
x.fillStyle='rgba(25,86,66,.45)';for(let i=0;i<15;i++){let xx=(i*131-cam*.25)% (W+100)-50,yy=80+(i*47)%260;x.beginPath();x.ellipse(xx,yy,8,18,Math.sin(i)*.8,0,7);x.fill()}x.restore();
// HUD updates
player.anim+=.08;document.getElementById('hpbar').style.width=Math.max(0,hp)+'%';document.getElementById('bossbar').style.width=100+'%';requestAnimationFrame(render)}
render();
