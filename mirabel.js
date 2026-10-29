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
let single=false,opened=false,busy=false,pos=0; // pos = index into seq of the right-hand (or single) page
const size=()=>{single=innerWidth<760;const r=1100/1200;let h,w;
 if(single){w=Math.min(innerWidth*.86,460);h=w/r}else{h=Math.min(innerHeight*.72,640);w=h*r;const maxW=Math.min(innerWidth,1400)*.9/2;if(w>maxW){w=maxW;h=w/r}}
 book.style.setProperty('--w',w+'px');book.style.setProperty('--h',h+'px');book.classList.toggle('single',single);
 if(!single)pos-=pos%2;render()};
const render=()=>{ if(single){iR.src=seq[pos];iR.alt=`Mirabel story — page ${pos+1}`}else{iR.src=seq[pos];iL.src=seq[pos+1];iR.alt=`Mirabel story — page ${pos+1}`;iL.alt=`Mirabel story — page ${pos+2}`}
 const step=single?1:2;bN.disabled=pos+step>=seq.length;bP.disabled=pos===0;
 cnt.textContent=single?`${pos+1} / ${seq.length}`:`Spread ${pos/2+1} / ${seq.length/2}`};
addEventListener('resize',()=>{clearTimeout(size.t);size.t=setTimeout(size,150)});size();
seq.forEach(s=>{const i=new Image();i.src=s});
// sparkles
for(let i=0;i<26;i++){const s=document.createElement('span');s.className='spk';s.style.cssText=`left:${Math.random()*110-5}%;top:${Math.random()*110-5}%;--s:${8+Math.random()*16}px;--d:${2+Math.random()*3}s;--dl:${Math.random()*4}s`;stage.appendChild(s)}
const open=()=>{if(opened||busy)return;busy=true;opened=true;pos=0;render();cb.src=seq[0];
 hero.classList.add('reading');const w=parseFloat(book.style.getPropertyValue('--w'));
 if(!single){book.style.transition='none';book.style.transform=`translateX(${w/2}px)`;book.offsetWidth;book.style.transition='';requestAnimationFrame(()=>{book.style.transform='';book.classList.add('open')})}
 else{requestAnimationFrame(()=>book.classList.add('open'))}
 hero.scrollIntoView({behavior:'smooth',block:'start'});
 setTimeout(()=>{cover.style.visibility='hidden';busy=false},1450)};
const closeB=()=>{if(busy)return;cover.style.visibility='';book.classList.remove('open');busy=true;setTimeout(()=>{hero.classList.remove('reading');opened=false;busy=false;pos=0;render()},1300)};
book.addEventListener('click',e=>{if(!opened)open()});book.addEventListener('keydown',e=>{if(!opened&&(e.key==='Enter'||e.key===' ')){e.preventDefault();open()}});
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
bN.onclick=next;bP.onclick=prev;bC.onclick=closeB;
addEventListener('keydown',e=>{if(lb.classList.contains('open')){if(e.key=='Escape')lb.classList.remove('open');if(e.key=='ArrowLeft')show(k-1);if(e.key=='ArrowRight')show(k+1);return}
 if(!opened)return;if(e.key==='ArrowLeft')next();if(e.key==='ArrowRight')prev();if(e.key==='Escape')closeB()});
let tx=null;stage.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
stage.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>40){dx>0?next():prev()}},{passive:true});
})();
