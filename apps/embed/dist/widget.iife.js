(function(){"use strict";const o={WIDGET_URL:"http://localhost:3001",DEFAULT_POSITION:"bottom-right"},u=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,x=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;(function(){let n=null,e=null,t=null,d=!1,r=null,s=o.DEFAULT_POSITION;const c=document.currentScript;if(c)r=c.getAttribute("data-workspace-id"),s=c.getAttribute("data-position")||o.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="embed"]'),a=Array.from(i).find(l=>l.hasAttribute("data-workspace-id"));a&&(r=a.getAttribute("data-workspace-id"),s=a.getAttribute("data-position")||o.DEFAULT_POSITION)}if(!r){console.error("Cenra Widget: data-workspace-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()}function f(){t=document.createElement("button"),t.id="cenra-widget-button",t.innerHTML=u,t.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35);
      transition: all 0.2s ease;
    `,t.addEventListener("click",y),t.addEventListener("mouseenter",()=>{t&&(t.style.transform="scale(1.05)")}),t.addEventListener("mouseleave",()=>{t&&(t.style.transform="scale(1)")}),document.body.appendChild(t),e=document.createElement("div"),e.id="cenra-widget-container",e.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,n=document.createElement("iframe"),n.src=b(),n.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,n.allow="microphone; clipboard-read; clipboard-write",e.appendChild(n),document.body.appendChild(e),window.addEventListener("message",m)}function b(){const i=new URLSearchParams;return i.append("workspaceId",r),`${o.WIDGET_URL}?${i.toString()}`}function m(i){if(i.origin!==new URL(o.WIDGET_URL).origin)return;const{type:a,payload:l}=i.data;switch(a){case"close":p();break;case"resize":l.height&&e&&(e.style.height=`${l.height}px`);break}}function y(){d?p():g()}function g(){e&&t&&(d=!0,e.style.display="block",setTimeout(()=>{e&&(e.style.opacity="1",e.style.transform="translateY(0)")},10),t.innerHTML=x)}function p(){e&&t&&(d=!1,e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e&&(e.style.display="none")},300),t.innerHTML=u,t.style.background="#3b82f6")}function w(){window.removeEventListener("message",m),e&&(e.remove(),e=null,n=null),t&&(t.remove(),t=null),d=!1}function k(i){w(),i.workspaceId&&(r=i.workspaceId),i.position&&(s=i.position),h()}window.CenraWidget={init:k,show:g,hide:p,destroy:w},h()})()})();
