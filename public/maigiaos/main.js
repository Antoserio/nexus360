const dialog=document.querySelector('.mos-film-dialog');
const video=dialog.querySelector('video');
const mediaRoot=new URL('media/',document.currentScript.src).href;
const films={
 overview:{file:'MAIGIA_OS_V16.mp4',poster:'hero.webp',subtitles:[{language:'es',label:'Español',file:'captions/overview-es.vtt'},{language:'en',label:'English',file:'captions/overview-en.vtt'}]},
 product:{file:'MAIGIA_OS_PRODUCT_DEMO.mp4',poster:'v14-product.webp'},
 joy:{file:'JOY_TIS_REFERENCE.mp4',poster:'v14-joy.webp'}
};
let filmOpener=null;
document.querySelectorAll('.mos-open-film').forEach(link=>link.addEventListener('click',event=>{
 const film=films[link.dataset.film];
 if(!film||typeof dialog.showModal!=='function')return;
 event.preventDefault();filmOpener=link;
 video.pause();
 video.querySelectorAll('track').forEach(track=>track.remove());
 video.poster=mediaRoot+film.poster;video.src=mediaRoot+film.file;
 (film.subtitles??[]).forEach(subtitle=>{
  const track=document.createElement('track');track.kind='subtitles';
  track.src=mediaRoot+subtitle.file;track.srclang=subtitle.language;track.label=subtitle.label;
  video.append(track);
 });
 dialog.querySelector('.mos-dialog-film-title').textContent=link.dataset.filmTitle;
 dialog.querySelector('.mos-dialog-film-note').textContent=link.dataset.filmCaption;
 dialog.querySelector('.mos-film-direct').href=mediaRoot+film.file;
 dialog.showModal();document.body.classList.add('mos-modal-open');
 video.play().catch(()=>{});dialog.querySelector('.mos-close-film').focus();
}));
dialog.querySelector('.mos-close-film').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
 if(event.target!==dialog)return;
 const box=dialog.getBoundingClientRect();
 if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
});
dialog.addEventListener('close',()=>{
 video.pause();video.removeAttribute('src');video.load();
 document.body.classList.remove('mos-modal-open');
 if(filmOpener?.isConnected)filmOpener.focus();
});
const mobileMenu=document.querySelector('.mos-mobile-menu');
mobileMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
 mobileMenu.open=false;
 const target=document.querySelector(link.getAttribute('href'));
 if(target){target.tabIndex=-1;target.focus({preventScroll:true});}
}));
mobileMenu?.addEventListener('keydown',event=>{
 if(event.key==='Escape'){mobileMenu.open=false;mobileMenu.querySelector('summary').focus();}
});
// Enhance the verified contact fallback into a direct, addressed email draft.
document.querySelectorAll('[data-mailto]').forEach(link=>{
 link.href='mailto:'+link.dataset.mailto+'?subject='+encodeURIComponent(link.dataset.subject);
});
