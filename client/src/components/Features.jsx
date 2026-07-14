import "../styles/Features.css";

import {

FaRobot,

FaShieldAlt,

FaChartLine,

FaBug,

FaHistory,

FaFileCode

}

from "react-icons/fa";

function Features(){

return(

<section className="features">

<h2>Powerful Features</h2>

<p>
Everything you need to review code intelligently.
</p>

<div className="feature-grid">

<div className="feature-card">

<FaRobot/>

<h3>AI Code Review</h3>

<p>

Receive intelligent suggestions using AI.

</p>

</div>

<div className="feature-card">

<FaShieldAlt/>

<h3>Security Scan</h3>

<p>

Detect common security vulnerabilities.

</p>

</div>

<div className="feature-card">

<FaChartLine/>

<h3>Performance</h3>

<p>

Improve speed and efficiency.

</p>

</div>

<div className="feature-card">

<FaBug/>

<h3>Bug Detection</h3>

<p>

Find logical and syntax issues.

</p>

</div>

<div className="feature-card">

<FaHistory/>

<h3>History</h3>

<p>

View previous AI reviews anytime.

</p>

</div>

<div className="feature-card">

<FaFileCode/>

<h3>Code Explanation</h3>

<p>

Understand every line of your code.

</p>

</div>

</div>

</section>

)

}

export default Features;