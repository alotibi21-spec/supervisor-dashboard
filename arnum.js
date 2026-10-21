/*! لوحة التحكم لعضو الفريق التنفيذي — © 1448هـ عبدالله خالد العتيبي. جميع الحقوق محفوظة. محلّل الأرقام العربية المنطوقة */
(function(G){
const norm=s=>String(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٫]/g,'.').replace(/٪/g,'%').replace(/[،,؛]/g,' ').replace(/\s+/g,' ').trim();
const U={صفر:0,واحد:1,واحده:1,احد:1,اثنين:2,اثنان:2,اثنتين:2,اثنتان:2,ثنين:2,اتنين:2,اثني:2,اثنا:2,ثلاث:3,ثلاثه:3,تلاته:3,تلات:3,اربع:4,اربعه:4,خمس:5,خمسه:5,ست:6,سته:6,سبع:7,سبعه:7,ثمان:8,ثماني:8,ثمانيه:8,ثمنيه:8,تمنيه:8,تسع:9,تسعه:9,
 احدعشر:11,حداش:11,اثنعشر:12,اطناش:12,اتناش:12,عشر:10,عشره:10};
const T={عشرين:20,عشرون:20,ثلاثين:30,ثلاثون:30,تلاتين:30,اربعين:40,اربعون:40,خمسين:50,خمسون:50,ستين:60,ستون:60,سبعين:70,سبعون:70,ثمانين:80,ثمانون:80,تمانين:80,تسعين:90,تسعون:90};
const H={مئه:100,ميه:100,مائه:100,مية:100,مئتين:200,مئتان:200,ميتين:200,مائتين:200,مائتان:200};
const K={الف:1000,الاف:1000,الفين:2000,الفان:2000};
function hund(w){if(H[w]!=null)return H[w];const m=w.match(/^(ثلاث|اربع|خمس|ست|سبع|ثمان|ثماني|تسع)(مئه|ميه|مائه)$/);return m?U[m[1]]*100:null}
function wv(w){// returns {k:type,v}
 if(/^\d+(\.\d+)?%?$/.test(w))return{k:'d',v:parseFloat(w)};
 if(U[w]!=null)return{k:w.startsWith('عشر')?'x':'u',v:U[w]};if(T[w]!=null)return{k:'t',v:T[w]};const h=hund(w);if(h!=null)return{k:'h',v:h};if(K[w]!=null)return{k:'k',v:K[w]};return null}
const PCT=/^(بالمئه|بالميه|بالمائه|بالمية|%|بالمئة|بالمائة|المئه|بالميه)$/;
function tokens(text){const out=[];for(let w of norm(text).split(' ')){if(!w)continue;let pct=false;if(/%$/.test(w)&&w.length>1){pct=true;w=w.slice(0,-1)}
  let conj=false;let v=wv(w);if(!v&&w.length>1&&w[0]==='و'){const r=wv(w.slice(1));if(r){v=r;conj=true}}
  if(v)out.push({...v,conj,w});else if(w==='و')out.push({k:'and'});else if(/^(فاصله|فاصل|نقطه|كسر)$/.test(w))out.push({k:'dot'});else if(PCT.test(w)||w==='في'&&false)out.push({k:'pct'});else out.push({k:'w',w});if(pct)out.push({k:'pct'})}
 // "في المية" => pct
 for(let i=0;i<out.length-1;i++)if(out[i].k==='w'&&out[i].w==='في'&&((out[i+1].k==='h'&&out[i+1].v===100)||(out[i+1].k==='w'&&/^ال(مئه|ميه|مائه)$/.test(out[i+1].w))||out[i+1].k==='pct')){out[i]={k:'pct'};out.splice(i+1,1)}
 return out}
/** parse all spoken/written numbers in order → [{v,pct,start,end}] (start/end = token indexes) */
function parseNums(text){const tk=tokens(text),R=[];let g=null,pendAnd=false;
 const close=()=>{if(g){g.v=g.total+g.chunk;delete g.total;delete g.chunk;delete g.last;R.push(g);g=null}};
 for(let i=0;i<tk.length;i++){const t=tk[i];
  if(t.k==='and'){pendAnd=true;continue}
  if(t.k==='pct'){if(g){g.pct=true}else if(R.length)R[R.length-1].pct=true;continue}
  if(t.k==='dot'){close();const p=R[R.length-1];if(p){p.dot=true}pendAnd=false;continue}
  if(t.k==='w'){close();pendAnd=false;continue}
  if(t.k==='d'){close();R.push({v:t.v,start:i,end:i});const p=R[R.length-2];if(p&&p.dot&&p.end===i-2){/*digit after dot*/}continue}
  const join=t.conj||pendAnd;pendAnd=false;
  if(g&&!join){// adjacency combos
   if(t.k==='x'&&g.last==='u'&&g.chunk%10===g.chunk){g.chunk+=10;g.last='x';g.end=i;continue}
   if(t.k==='h'&&g.last==='u'&&t.v===100){g.chunk=g.chunk*100;g.last='h';g.end=i;continue}
   if(t.k==='k'&&(g.last==='u'||g.last==='t'||g.last==='h'||g.last==='x')){g.total+=(g.chunk||1)*1000;g.chunk=0;g.last='k';g.end=i;continue}
   close()}
  if(g&&join){// "و" continuation — but a smaller-or-equal magnitude must follow
   const lastMag={u:1,x:2,t:2,h:3,k:4}[g.last],m={u:1,x:2,t:2,h:3,k:4}[t.k];
   if(t.k==='k'){g.total+=(g.chunk||1)*1000;g.chunk=0;g.last='k';g.end=i;continue}
   if(m<lastMag||(g.last==='u'&&t.k==='t'&&g.chunk%100<10)){g.chunk+=t.v;g.last=t.k;g.end=i;continue}
   close()}
  if(!g){g={total:0,chunk:0,start:i,end:i,last:null}}
  if(t.k==='k'){g.total+=t.v;g.last='k'}else{g.chunk+=t.v;g.last=t.k}g.end=i}
 close();
 // merge decimals: X dot Y
 const out=[];for(let i=0;i<R.length;i++){const r=R[i];if(r.dot&&R[i+1]){const f=R[i+1];const s=String(f.v).replace('.','');out.push({v:parseFloat(r.v+'.'+s),pct:r.pct||f.pct,start:r.start,end:f.end});i++}else out.push({v:r.v,pct:!!r.pct,start:r.start,end:r.end})}
 return out}
/** labelled: labels = [[field, RegExp on normalized text], ...]; returns {field:{v,pct}} */
function parseLabeled(text,labels){const t=norm(text),hits=[];
 for(const [f,re] of labels){const g=new RegExp(re.source,'g');let m;while((m=g.exec(t))){hits.push({f,i:m.index,e:m.index+m[0].length})}}
 hits.sort((a,b)=>a.i-b.i||(b.e-b.i)-(a.e-a.i));const used=[];for(const h of hits){if(used.some(u=>h.i<u.e&&h.e>u.i))continue;used.push(h)}
 used.sort((a,b)=>a.i-b.i);const out={};used.forEach((h,j)=>{const seg=t.slice(h.e,j+1<used.length?used[j+1].i:t.length);const n=parseNums(seg)[0];if(n&&out[h.f]==null)out[h.f]={v:n.v,pct:n.pct}});return out}
const api={norm,parseNums,parseLabeled,nums:t=>parseNums(t).map(x=>x.v)};
if(typeof module!=='undefined')module.exports=api;else G.ARNUM=api})(typeof window!=='undefined'?window:globalThis);
