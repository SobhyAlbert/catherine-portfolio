(()=>{
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// language toggle
const en=document.getElementById('en'),ar=document.getElementById('ar'),tg=document.getElementById('tg');let isAr=false;
tg.onclick=()=>{const [a,b]=isAr?[ar,en]:[en,ar];a.classList.add('fade');setTimeout(()=>{a.classList.add('hidden');b.classList.remove('hidden');requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.remove('fade')))},450);isAr=!isAr;tg.textContent=isAr?'English':'العربية';tg.lang=isAr?'en':'ar'};
// lightbox
const imgs=[...document.querySelectorAll('#gal img')],lb=document.getElementById('lb'),li=document.getElementById('lbi');let k=0;
const show=i=>{k=(i+imgs.length)%imgs.length;li.src=imgs[k].src;li.alt=imgs[k].alt;lb.classList.add('open')};
imgs.forEach((im,i)=>im.parentElement.onclick=()=>show(i));
lb.querySelector('.x').onclick=()=>lb.classList.remove('open');lb.querySelector('.pv').onclick=e=>{e.stopPropagation();show(k-1)};lb.querySelector('.nx').onclick=e=>{e.stopPropagation();show(k+1)};
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('open')};
// book
const P='assets/illustration/mirabel/',N=6,src=(n,s)=>`${P}s${n}${s}.webp`;
const seq=[];for(let n=1;n<=N;n++){seq.push(src(n,'r'),src(n,'l'))} // RTL reading order
const hero=document.getElementById('hero'),book=document.getElementById('book'),cover=document.getElementById('cover'),stage=document.getElementById('stage');
const iL=document.getElementById('imgL'),iR=document.getElementById('imgR'),cb=document.getElementById('coverBack'),cnt=document.getElementById('count');
const bN=document.getElementById('next'),bP=document.getElementById('prev'),bC=document.getElementById('close');
let land=false,rot=false,single=false,opened=false,busy=false,pos=0; // pos = index into seq of the right-hand (or single) page
const vp=()=>{book.style.setProperty('--w','0px');book.style.setProperty('--h','0px');void document.documentElement.offsetWidth; // collapse book so it can't widen the layout viewport
 const vv=window.visualViewport;let W=Math.min(innerWidth,document.documentElement.clientWidth||innerWidth),H=innerHeight;
 if(vv&&!land){W=Math.min(W,Math.round(vv.width*vv.scale))}return [W,H]};
const size=()=>{const [IW,IH]=vp();rot=land&&IH>IW;hero.classList.toggle('rot',rot);
 const VW=rot?IH:IW,VH=rot?IW:IH;
 single=!land&&IW<760;const r=1100/1200;let h,w;
 if(land){h=VH*.8;w=h*r;if(w*2>VW*.92){w=VW*.46;h=w/r}}
 else if(single){w=Math.min(IW*.86,460);h=w/r}else{h=Math.min(IH*.72,640);w=h*r;const maxW=Math.min(IW,1400)*.9/2;if(w>maxW){w=maxW;h=w/r}}
 book.style.setProperty('--w',w+'px');book.style.setProperty('--h',h+'px');book.classList.toggle('single',single);
 if(!single)pos-=pos%2;render()};
const render=()=>{ if(single){iR.src=seq[pos];iR.alt=`Mirabel story — page ${pos+1}`}else{iR.src=seq[pos];iL.src=seq[pos+1];iR.alt=`Mirabel story — page ${pos+1}`;iL.alt=`Mirabel story — page ${pos+2}`}
 const step=single?1:2;bN.disabled=pos+step>=seq.length;bP.disabled=pos===0;
 cnt.textContent=single?`${pos+1} / ${seq.length}`:`Spread ${pos/2+1} / ${seq.length/2}`};
addEventListener('resize',()=>{clearTimeout(size.t);size.t=setTimeout(size,150)});size();
seq.forEach(s=>{const i=new Image();i.src=s});
// sparkles
for(let i=0;i<26;i++){const s=document.createElement('span');s.className='spk';s.style.cssText=`left:${Math.random()*110-5}%;top:${Math.random()*110-5}%;--s:${8+Math.random()*16}px;--d:${2+Math.random()*3}s;--dl:${Math.random()*4}s`;stage.appendChild(s)}
const isMob=()=>matchMedia('(pointer:coarse)').matches&&Math.min(innerWidth,innerHeight)<760;
const enterLand=()=>{land=true;savedY=scrollY;try{history.pushState({mbook:1},'');histPushed=true}catch(e){}hero.classList.add('land');document.documentElement.classList.add('land-lock');
 const d=document.documentElement;try{const fp=d.requestFullscreen?d.requestFullscreen({navigationUI:'hide'}):null;
  if(fp)fp.then(()=>screen.orientation&&screen.orientation.lock?screen.orientation.lock('landscape'):0).then(()=>setTimeout(size,250)).catch(()=>{})}catch(e){}
 size()};
let savedY=0,histPushed=false;
const resettle=()=>{size();requestAnimationFrame(size)};
const settle=()=>{resettle();[120,350,700,1200].forEach(t=>setTimeout(resettle,t));
 const once=()=>{resettle();removeEventListener('resize',once);removeEventListener('orientationchange',once)};addEventListener('resize',once);addEventListener('orientationchange',once);setTimeout(once,1500)};
const exitLand=async(fromHist)=>{if(!land)return;land=false;rot=false;hero.classList.remove('land','rot');document.documentElement.classList.remove('land-lock');
 try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock()}catch(e){}
 if(document.fullscreenElement&&document.exitFullscreen){try{await document.exitFullscreen()}catch(e){}}
 if(histPushed&&!fromHist){histPushed=false;try{history.back()}catch(e){}}histPushed=false;
 const m=document.querySelector('meta[name=viewport]');if(m){const c='width=device-width, initial-scale=1';m.setAttribute('content',c+', maximum-scale=1');setTimeout(()=>m.setAttribute('content',c),400)}
 settle()};
const open=()=>{if(opened||busy)return;if(isMob())enterLand();busy=true;opened=true;pos=0;render();cb.src=seq[0];
 hero.classList.add('reading');const w=parseFloat(book.style.getPropertyValue('--w'));
 if(!single){book.style.transition='none';book.style.transform=`translateX(${w/2}px)`;book.offsetWidth;book.style.transition='';requestAnimationFrame(()=>{book.style.transform='';book.classList.add('open')})}
 else{requestAnimationFrame(()=>book.classList.add('open'))}
 if(!land)hero.scrollIntoView({behavior:'smooth',block:'start'});
 setTimeout(()=>{cover.style.visibility='hidden';busy=false},1450)};
const shut=fromHist=>{exitLand(fromHist);cover.style.visibility='';book.style.transition='none';book.style.transform='';book.querySelectorAll('.leaf').forEach(l=>l.remove());busy=false;book.classList.remove('open');hero.classList.remove('reading');opened=false;pos=0;render();
 requestAnimationFrame(()=>{book.style.transition='';scrollTo(0,savedY)});setTimeout(()=>scrollTo(0,savedY),450)};
addEventListener('popstate',()=>{if(land&&opened){histPushed=false;shut(true)}});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&land&&opened&&histPushed===true&&!document.hidden){/* user left fullscreen via system UI */shut(false)}});
const closeB=()=>{if(busy)return;if(land){shut(false);return}cover.style.visibility='';book.classList.remove('open');busy=true;setTimeout(()=>{hero.classList.remove('reading');opened=false;busy=false;pos=0;render()},1300)};
book.addEventListener('click',e=>{if(!opened){open();return}if(land&&!busy){const b=book.getBoundingClientRect();const f=rot?(e.clientY-b.top)/b.height:(e.clientX-b.left)/b.width;f<.5?next():prev()}});book.addEventListener('keydown',e=>{if(!opened&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open()}});
const leaf=(front,back,left,from,to,done,org='right center')=>{const l=document.createElement('div');l.className='leaf';l.style.left=left;
 l.style.transformOrigin=org;
 l.innerHTML=`<div class="face front"><img src="${front}" alt=""></div><div class="face back"><img src="${back}" alt=""></div>`;
 l.style.transform=`rotateY(${from}deg)`;book.appendChild(l);l.offsetWidth;l.classList.add('turning');l.style.transform=`rotateY(${to}deg)`;
 l.addEventListener('transitionend',function f(e){if(e.propertyName!=='transform')return;l.removeEventListener('transitionend',f);done();l.remove();busy=false},{once:false})};
const next=()=>{if(!opened||busy)return;const step=single?1:2;if(pos+step>=seq.length)return;busy=true;
 if(single){const cur=seq[pos];pos++;render();leaf(cur,cur,'0px',0,180,()=>{});return}
 const curL=seq[pos+1],nR=seq[pos+2],nL=seq[pos+3];iL.src=nL; // reveal next left underneath
 leaf(curL,nR,'0px',0,180,()=>{pos+=2;render()})};
const prev=()=>{if(!opened||busy)return;if(pos===0)return;busy=true;
 if(single){const p=seq[pos-1];leaf(p,p,'0px',180,0,()=>{pos--;render()});return}
 const curR=seq[pos],pL=seq[pos-1],pR=seq[pos-2];iR.src=pR;
 leaf(curR,pL,'var(--w)',0,-180,()=>{pos-=2;render()},'left center')};
document.getElementById('landX').onclick=e=>{e.stopPropagation();closeB()};
bN.onclick=next;bP.onclick=prev;bC.onclick=closeB;
addEventListener('keydown',e=>{if(lb.classList.contains('open')){if(e.key=='Escape')lb.classList.remove('open');if(e.key=='ArrowLeft')show(k-1);if(e.key=='ArrowRight')show(k+1);return}
 if(!opened)return;if(e.key==='ArrowLeft')next();if(e.key==='ArrowRight')prev();if(e.key==='Escape')closeB()});
let tx=null;const tc=t=>rot?t.clientY:t.clientX;stage.addEventListener('touchstart',e=>{tx=tc(e.touches[0])},{passive:true});
stage.addEventListener('touchend',e=>{if(tx===null)return;const dx=tc(e.changedTouches[0])-tx;tx=null;if(Math.abs(dx)>40){dx>0?next():prev()}},{passive:true});
})();
