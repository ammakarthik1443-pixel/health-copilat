

import { useEffect, useState } from "react";

import {

  FileText, Droplet, Heart, Activity, AlertTriangle, Wind,

  BarChart3, ChevronRight, ChevronDown, HeartPulse, Lightbulb,

  Droplets, Moon, Dumbbell, Info, TrendingUp

} from "lucide-react";

import "../styles/HealthInsights.css";

const findings = [

  {

    title: "Blood Sugar",

    description: "Your average blood sugar levels are in the normal range.",

    status: "Normal",

    type: "pink",

    Icon: Droplet,

  },

  {

    title: "Heart Health",

    description: "Your heart rate is stable and within a healthy range.",

    status: "Good",

    type: "pink",

    Icon: Heart,

  },

  {

    title: "Lung Health",

    description: "No significant issues detected in your recent reports.",

    status: "Normal",

    type: "blue",

    Icon: Wind,

  },

  {

    title: "Cholesterol",

    description: "Cholesterol level is slightly elevated. Consider a balanced diet.",

    status: "Needs Attention",

    type: "orange",

    Icon: AlertTriangle,

  },

];

const trendData = {

  "Blood Sugar": {

    values: [110, 125, 118, 140, 132, 120],

    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],

    unit: "mg/dL",

    min: 50,

    max: 200,

  },

  "Blood Pressure": {

    values: [122, 120, 124, 118, 121, 120],

    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],

    unit: "mmHg (systolic)",

    min: 80,

    max: 160,

  },

  "Heart Rate": {

    values: [75, 73, 76, 70, 74, 72],

    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],

    unit: "bpm",

    min: 40,

    max: 120,

  },

  Cholesterol: {

    values: [185, 190, 198, 205, 202, 210],

    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],

    unit: "mg/dL",

    min: 100,

    max: 300,

  },

};

const tips = [

  {

    title: "Stay Hydrated",

    description: "Drink at least 2–3 liters of water daily.",

    Icon: Droplets,

    type: "tip-blue",

  },

  {

    title: "Get Better Sleep",

    description: "Aim for 7–8 hours of quality sleep every night.",

    Icon: Moon,

    type: "tip-purple",

  },

  {

    title: "Stay Active",

    description: "Do at least 30 minutes of physical activity daily.",

    Icon: Dumbbell,

    type: "tip-green",

  },

];

function TrendChart({ metric }) {

  const data = trendData[metric];

  const width = 520;

  const height = 190;

  const left = 45;

  const right = 10;

  const top = 18;

  const bottom = 36;

  const plotWidth = width - left - right;

  const plotHeight = height - top - bottom;

  const points = data.values.map((value, index) => ({

    x: left + (index * plotWidth) / (data.values.length - 1),

    y: top + ((data.max - value) / (data.max - data.min)) * plotHeight,

    value,

    label: data.labels[index],

  }));

  const linePath = points

    .map((point, index) =>

      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`

    )

    .join(" ");

  const areaPath =

    `${linePath} L ${points[points.length - 1].x} ${top + plotHeight}` +

    ` L ${points[0].x} ${top + plotHeight} Z`;

  const ticks = Array.from({ length: 4 }, (_, i) =>

    Math.round(data.max - (i * (data.max - data.min)) / 3)

  );

  return (

    <div className="hi-chart-container">

      <div className="hi-chart-unit">{data.unit}</div>

      <svg

        className="hi-chart"

        viewBox={`0 0 ${width} ${height}`}

        role="img"

        aria-label={`${metric} trend for the last six months`}

      >

        <defs>

          <linearGradient id="hiChartFill" x1="0" y1="0" x2="0" y2="1">

            <stop offset="0%" stopColor="#1685ff" stopOpacity=".25" />

            <stop offset="100%" stopColor="#1685ff" stopOpacity=".03" />

          </linearGradient>

        </defs>

        {ticks.map((tick, index) => {

          const y = top + (index * plotHeight) / 3;

          return (

            <g key={tick}>

              <line

                x1={left}

                y1={y}

                x2={width - right}

                y2={y}

                stroke="#e7eef9"

                strokeDasharray="3 3"

              />

              <text

                x={left - 8}

                y={y + 4}

                textAnchor="end"

                fontSize="12"

                fill="#3b588c"

              >

                {tick}

              </text>

            </g>

          );

        })}

        {points.map((point) => (

          <line

            key={`v-${point.label}`}

            x1={point.x}

            y1={top}

            x2={point.x}

            y2={top + plotHeight}

            stroke="#eef3fc"

          />

        ))}

        <path d={areaPath} fill="url(#hiChartFill)" />

        <path

          d={linePath}

          fill="none"

          stroke="#0878f9"

          strokeWidth="2.5"

          strokeLinejoin="round"

          strokeLinecap="round"

        />

        {points.map((point) => (

          <g key={point.label}>

            <text

              x={point.x}

              y={point.y - 12}

              textAnchor="middle"

              fontSize="12"

              fontWeight="600"

              fill="#123b81"

            >

              {point.value}

            </text>

            <circle

              cx={point.x}

              cy={point.y}

              r="5"

              fill="#0878f9"

              stroke="white"

              strokeWidth="1.5"

            />

            <text

              x={point.x}

              y={height - 10}

              textAnchor="middle"

              fontSize="12"

              fill="#31538d"

            >

              {point.label}

            </text>

          </g>

        ))}

      </svg>

    </div>

  );

}

function RobotIllustration() {

  return (

    <div className="hi-hero-art" aria-hidden="true">

      <div className="hi-plant hi-plant-left"><i /><i /><i /></div>

      <div className="hi-plant hi-plant-right"><i /><i /><i /></div>

      <div className="hi-floating-chart"><BarChart3 size={37} /></div>

      <div className="hi-floating-heart"><Heart size={31} fill="currentColor" /></div>

      <div className="hi-robot">

        <span className="hi-robot-antenna" />

        <div className="hi-robot-ear hi-ear-left" />

        <div className="hi-robot-ear hi-ear-right" />

        <div className="hi-robot-head">

          <span className="hi-robot-eye" />

          <span className="hi-robot-eye" />

          <span className="hi-robot-smile" />

        </div>

        <div className="hi-robot-neck" />

        <div className="hi-robot-body">

          <HeartPulse size={38} />

        </div>

        <div className="hi-robot-arm hi-arm-left" />

        <div className="hi-robot-arm hi-arm-right" />

        <div className="hi-robot-tablet"><TrendingUp size={28} /></div>

      </div>

      <div className="hi-hero-speech">

        <Lightbulb size={25} />

        <span>Here are your personalized health insights!</span>

      </div>

    </div>

  );

}

export default function HealthInsights() {

  const [metric, setMetric] = useState("Blood Sugar");

  const [period, setPeriod] = useState("Last 6 Months");

  const [showAllVitals, setShowAllVitals] = useState(false);

  const [showMoreTips, setShowMoreTips] = useState(false);

  const [selectedFinding, setSelectedFinding] = useState(null);

  const [filename, setFilename] = useState(() => {

  try {

    const saved = localStorage.getItem("latestUploadedReport");

    return saved ? JSON.parse(saved).filename || "" : "";

  } catch {

    return "";

  }

});

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

  const displayedTips = showMoreTips

    ? [

        ...tips,

        {

          title: "Eat Balanced Meals",

          description: "Include vegetables, fruits and whole grains.",

          Icon: HeartPulse,

          type: "tip-orange",

        },

      ]

    : tips;

  const analyzeReport = async (filenameToAnalyze = filename) => {
    const cleanFilename = (filenameToAnalyze || "").trim();

    if (!cleanFilename) {
      setAnalysisError("Please enter the uploaded PDF filename.");
      return;
    }

    setLoading(true);
    setAnalysisError("");
    setReport(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/analyze/${encodeURIComponent(cleanFilename)}`
      );
      const data = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : data.detail;
        throw new Error(detail || "Report analysis failed.");
      }

      setReport(data);
    } catch (error) {
      setAnalysisError(
        error.message === "Failed to fetch"
          ? "Backend connect aagala. Backend server running-la irukka check pannunga."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically analyze the most recently uploaded PDF from the Dashboard.
  useEffect(() => {
    try {
      const savedReport = localStorage.getItem("latestUploadedReport");
      if (!savedReport) return;

      const parsedReport = JSON.parse(savedReport);
      if (
        !parsedReport.filename ||
        !parsedReport.filename.toLowerCase().endsWith(".pdf")
      ) {
        return;
      }

      setFilename(parsedReport.filename);
      analyzeReport(parsedReport.filename);
    } catch (error) {
      console.error("Could not load the latest uploaded report:", error);
      setAnalysisError(
        "Could not read the saved report details. Please upload the PDF again."
      );
    }
  }, []);

  return (

    <main className="health-insights-page">

      <section className="hi-hero">

        <div className="hi-hero-copy">

          <h1>Health <span>Insights</span></h1>

          <h2>Understand patterns in your health data</h2>

          <p>

            Our AI analyzes your medical reports, prescriptions and health data

            to identify trends, highlight key findings and provide personalized suggestions.

          </p>

        </div>

        <RobotIllustration />

      </section>

      <section className="hi-card hi-report-analysis-card">

        <div className="hi-card-heading-row">

          <div className="hi-heading-icon icon-blue"><FileText size={25} /></div>

          <h3>Analyze Medical Report</h3>

        </div>

        <p className="hi-analysis-description">

          Enter the saved filename of a PDF you already uploaded in the Dashboard.

        </p>

        <form

          className="hi-analysis-form"

          onSubmit={(event) => {

            event.preventDefault();

            analyzeReport();

          }}

        >

          <input

            type="text"

            value={filename}

            onChange={(event) => setFilename(event.target.value)}

            placeholder="Enter uploaded PDF filename (including .pdf)"

            aria-label="Uploaded PDF filename"

          />

          <button type="submit" disabled={loading}>

            {loading ? "Analyzing..." : "Analyze Report"}

          </button>

        </form>

        {loading && (

          <p className="hi-analysis-loading" role="status">

            Reading PDF and extracting lab values...

          </p>

        )}

        {analysisError && (

          <div className="hi-analysis-error" role="alert">{analysisError}</div>

        )}

        {report && (

          <div className="hi-analysis-results">

            <div className="hi-analysis-result-heading">

              <div>

                <h4>Extracted Lab Values</h4>

                <p>File: {report.filename} · Pages: {report.pages}</p>

              </div>

              <span className="hi-analysis-success">Analysis complete</span>

            </div>

            {report.lab_values && report.lab_values.length > 0 ? (

              <div className="hi-lab-results-grid">

                {report.lab_values.map((item, index) => (

                  <article className="hi-lab-result" key={`${item.test}-${index}`}>

                    <h5>{item.test}</h5>

                    <div className="hi-lab-value">

                      {item.value ?? "Not detected"}

                      {item.unit ? ` ${item.unit}` : ""}

                    </div>

                    <p><strong>Reference range:</strong> {item.reference_range || "Not available"}</p>

                    <p><strong>Report flag:</strong> {item.flag || "Not available"}</p>

                  </article>

                ))}

              </div>

            ) : (

              <p>No lab values were detected in this PDF.</p>

            )}

            <details className="hi-extracted-text">

              <summary>View extracted PDF text</summary>

              <pre>{report.extracted_text}</pre>

            </details>

            <p className="hi-analysis-disclaimer">

              Extracted information is for reference only and is not a medical diagnosis.

              Please consult a qualified healthcare professional for interpretation.

            </p>

          </div>

        )}

      </section>

      <section className="hi-top-grid">

        <div className="hi-card hi-findings-card">

          <div className="hi-card-heading-row">

            <div className="hi-heading-icon icon-purple"><FileText size={25} /></div>

            <h3>Key Findings</h3>

            <button

              className="hi-link-btn"

              type="button"

              onClick={() => setSelectedFinding(

                selectedFinding === "all" ? null : "all"

              )}

            >

              {selectedFinding === "all" ? "Hide Details" : "View Details"}

              <ChevronRight size={18} />

            </button>

          </div>

          <div className="hi-findings-list">

            {findings.map(({ title, description, status, type, Icon }) => (

              <button

                type="button"

                className={`hi-finding-row ${selectedFinding === title ? "finding-selected" : ""}`}

                key={title}

                onClick={() => setSelectedFinding(

                  selectedFinding === title ? null : title

                )}

              >

                <span className={`hi-finding-icon ${type}`}><Icon size={29} /></span>

                <span className="hi-finding-copy">

                  <strong>{title}</strong>

                  <small>{description}</small>

                  {(selectedFinding === title || selectedFinding === "all") && (

                    <em>

                      Sample insight only. Review your actual test results with a healthcare professional.

                    </em>

                  )}

                </span>

                <span className={`hi-status ${

                  status === "Needs Attention" ? "status-attention" : "status-good"

                }`}>{status}</span>

                <ChevronRight className="hi-finding-chevron" size={20} />

              </button>

            ))}

          </div>

        </div>

        <div className="hi-card hi-trends-card">

          <div className="hi-card-heading-row">

            <div className="hi-heading-icon icon-blue"><BarChart3 size={27} /></div>

            <h3>Health Trends</h3>

            <label className="hi-period-select">

              <select value={period} onChange={(event) => setPeriod(event.target.value)}>

                <option>Last 6 Months</option>

                <option>Last 3 Months</option>

                <option>Last 12 Months</option>

              </select>

              <ChevronDown size={16} />

            </label>

          </div>

          <div className="hi-metric-tabs">

            {Object.keys(trendData).map((name) => (

              <button

                key={name}

                type="button"

                className={metric === name ? "metric-active" : ""}

                onClick={() => setMetric(name)}

              >

                {name}

              </button>

            ))}

          </div>

          <TrendChart metric={metric} />

          <p className="hi-chart-note">

            Illustrative sample data · {period.toLowerCase()}

          </p>

        </div>

      </section>

      <section className="hi-bottom-grid">

        <div className="hi-card hi-vitals-card">

          <div className="hi-card-heading-row">

            <div className="hi-heading-icon icon-pink"><HeartPulse size={27} /></div>

            <h3>Vitals Overview</h3>

            <button

              type="button"

              className="hi-link-btn"

              onClick={() => setShowAllVitals((value) => !value)}

            >

              {showAllVitals ? "Show Less" : "View All"}

              <ChevronRight size={18} />

            </button>

          </div>

          <div className="hi-vitals-grid">

            <div className="hi-vital vital-pink">

              <span className="hi-vital-icon"><HeartPulse size={34} /></span>

              <div>

                <small>Blood Pressure</small>

                <strong>120/80</strong>

                <span>mmHg</span>

                <em>Normal</em>

              </div>

            </div>

            <div className="hi-vital vital-blue">

              <span className="hi-vital-icon"><HeartPulse size={34} /></span>

              <div>

                <small>Heart Rate</small>

                <strong>72</strong>

                <span>bpm</span>

                <em>Normal</em>

              </div>

            </div>

            <div className="hi-vital vital-purple">

              <span className="hi-vital-icon"><Droplet size={34} /></span>

              <div>

                <small>Blood Sugar</small>

                <strong>110</strong>

                <span>mg/dL</span>

                <em>Normal</em>

              </div>

            </div>

            {showAllVitals && (

              <>

                <div className="hi-vital vital-green">

                  <span className="hi-vital-icon"><Activity size={34} /></span>

                  <div><small>Oxygen Level</small><strong>98%</strong><span>SpO₂</span><em>Normal</em></div>

                </div>

                <div className="hi-vital vital-orange">

                  <span className="hi-vital-icon"><TrendingUp size={34} /></span>

                  <div><small>Cholesterol</small><strong>205</strong><span>mg/dL</span><em>Review</em></div>

                </div>

              </>

            )}

          </div>

        </div>

        <div className="hi-card hi-tips-card">

          <div className="hi-card-heading-row">

            <div className="hi-heading-icon icon-orange"><Lightbulb size={27} /></div>

            <h3>Personalized Tips</h3>

            <button

              type="button"

              className="hi-link-btn"

              onClick={() => setShowMoreTips((value) => !value)}

            >

              {showMoreTips ? "View Less" : "View More"}

              <ChevronRight size={18} />

            </button>

          </div>

          <div className="hi-tips-grid">

            {displayedTips.map(({ title, description, Icon, type }) => (

              <div className={`hi-tip ${type}`} key={title}>

                <Icon size={35} className="hi-tip-icon" />

                <div>

                  <strong>{title}</strong>

                  <p>{description}</p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      <footer className="hi-disclaimer">

        <Info size={22} fill="currentColor" />

        <span>

          AI-generated information is for educational purposes and is not a medical diagnosis.

        </span>

      </footer>

    </main>

  );

}
