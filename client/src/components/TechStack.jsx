import "../styles/TechStack.css";
import {
 FaReact,
 FaNodeJs,
 FaPython,
 FaJava,
 FaDatabase
} from "react-icons/fa";

import { SiJavascript } from "react-icons/si";

function TechStack(){

return(

<section className="tech">

<h2>Powered By Modern Technologies</h2>

<p>
Built using the latest web technologies and AI tools.
</p>

<div className="tech-grid">

<div className="tech-card">
<FaNodeJs/>
<h3>Node.js</h3>
</div>

<div className="tech-card">
<SiJavascript/>
<h3>JavaScript</h3>
</div>

<div className="tech-card">
<FaPython/>
<h3>Python</h3>
</div>

<div className="tech-card">
<FaJava/>
<h3>Java</h3>
</div>

<div className="tech-card">
<FaDatabase/>
<h3>PostgreSQL</h3>
</div>

<div className="tech-card">
  <FaDatabase />
  <h3>OpenAI API</h3>
</div>

</div>

</section>

)

}

export default TechStack;