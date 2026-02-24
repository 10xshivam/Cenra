(function(){"use strict";const o={WIDGET_URL:"http://localhost:3001",DEFAULT_POSITION:"bottom-right"},p=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
</svg>`,b=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;(function(){let n=null,t=null,e=null,d=!1,r=null,a=o.DEFAULT_POSITION;const c=document.currentScript;if(c)r=c.getAttribute("data-organization-id"),a=c.getAttribute("data-position")||o.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="embed"]'),s=Array.from(i).find(l=>l.hasAttribute("data-organization-id"));s&&(r=s.getAttribute("data-organization-id"),a=s.getAttribute("data-position")||o.DEFAULT_POSITION)}if(!r){console.error("Cenra Widget: data-organization-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()}function g(){e=document.createElement("button"),e.id="cenra-widget-button",e.innerHTML=p,e.style.cssText=`
      position: fixed;
      ${a==="bottom-right"?"right: 20px;":"left: 20px;"}
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
    `,e.addEventListener("click",y),e.addEventListener("mouseenter",()=>{e&&(e.style.transform="scale(1.05)")}),e.addEventListener("mouseleave",()=>{e&&(e.style.transform="scale(1)")}),document.body.appendChild(e),t=document.createElement("div"),t.id="cenra-widget-container",t.style.cssText=`
      position: fixed;
      ${a==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 410px;
      height: 701px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,n=document.createElement("iframe"),n.src=w(),n.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,n.allow="microphone; clipboard-read; clipboard-write",t.appendChild(n),document.body.appendChild(t),window.addEventListener("message",f)}function w(){const i=new URLSearchParams;return i.append("organizationId",r),`${o.WIDGET_URL}?${i.toString()}`}function f(i){if(i.origin!==new URL(o.WIDGET_URL).origin)return;const{type:s,payload:l}=i.data;switch(s){case"close":u();break;case"resize":l.height&&t&&(t.style.height=`${l.height}px`);break}}function y(){d?u():m()}function m(){t&&e&&(d=!0,t.style.display="block",setTimeout(()=>{t&&(t.style.opacity="1",t.style.transform="translateY(0)")},10),e.innerHTML=b)}function u(){t&&e&&(d=!1,t.style.opacity="0",t.style.transform="translateY(10px)",setTimeout(()=>{t&&(t.style.display="none")},300),e.innerHTML=p,e.style.background="#3b82f6")}function x(){window.removeEventListener("message",f),t&&(t.remove(),t=null,n=null),e&&(e.remove(),e=null),d=!1}function v(i){x(),i.organizationId&&(r=i.organizationId),i.position&&(a=i.position),h()}window.EchoWidget={init:v,show:m,hide:u,destroy:x},h()})()})();