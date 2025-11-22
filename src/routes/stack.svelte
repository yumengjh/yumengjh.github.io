<script>
    import { messages } from '../i18n/store';
    $: t = $messages;
  </script>
  
  <svelte:head>
    <title>{t?.stack?.title || 'My Stack'}</title>
  </svelte:head>
  
  <section class="hero-card hero-minimal">
    <p class="tagline">{t?.stack?.tagline || 'My Stack'}</p>
    <h1>{t?.stack?.title || 'My Stack'}</h1>
    <p class="lead">
       {t?.stack?.description || 'My tech stack has:'}
    </p>
  </section>
  
  <img src="https://img.shields.io/badge/-NestJs-ea2845?logo=nestjs&logoColor=white" alt="Nest.js" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/Express-000000?logo=Express&logoColor=fff" alt="Express" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&amp;logoColor=333" alt="JavaScript" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=TypeScript&amp;logoColor=fff" alt="TypeScript" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?logo=Vue.js&logoColor=fff" alt="Vue3" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=000" alt="React" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Ant_Design-1677FF?logo=AntDesign&logoColor=fff" alt="Ant_Design" style="display: 
inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS" style="display: inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Lodash-3498db?logo=Lodash&logoColor=fff" alt="Lodash" style="display: 
inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Axios-5A29E4?logo=Axios&logoColor=fff" alt="Axios" style="display: 
inline-block;" />&nbsp;

<img src="https://img.shields.io/badge/Docker-2496ED?logo=Docker&logoColor=fff" alt="Docker" style="display: 
inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=fff" alt="Docker" style="display: 
inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/Rollup-EC4A3F?logo=Rollup.js&logoColor=fff" alt="Rollup" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff" alt="Jest" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/-Git-F05032?logo=Git&logoColor=FFF" alt="Git" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/-GitHub-181717?logo=GitHub&logoColor=FFF" alt="GitHub" style="display: inline-block;" />&nbsp;
  <img src="https://img.shields.io/badge/Netlify-00C7B7?logo=Netlify&logoColor=fff" alt="Netlify" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=fff" alt="Vercel" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=fff" alt="Cloudflare" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=fff" alt="Supabase" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff" alt="MySQL" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=fff" alt="Postman" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Hoppscotch-FF5722?logo=hoppscotch&logoColor=fff" alt="Hoppscotch" style="display: inline-block;" />&nbsp;
<img src="https://img.shields.io/badge/Visual_Studio_Code-007ACC?logo=VisualStudioCode&logoColor=fff" alt="VScode" style="display: 
inline-block;" />&nbsp;






<img src="https://img.shields.io/badge/OpenAI-000000?logo=OpenAI&logoColor=fff" alt="ChatGPT" style="display: 
inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Gemini-3287fa?logo=google&logoColor=fff" alt="Gemini" style="display: inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Claude_AI-DA7756?logo=claude&logoColor=fff" alt="Claude AI" style="display: inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Copilot-000000?logo=GitHubCopilot&logoColor=fff" alt="Copilot" style="display: 
inline-block;" />&nbsp;
 <img src="https://img.shields.io/badge/Cursor-F5F5F5?logo=data:image/png;base64,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" alt="Cursor" style="display: 
inline-block;"> &nbsp;
