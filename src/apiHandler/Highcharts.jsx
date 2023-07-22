import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const GithubActivityChart = ({ owner, repo }) => {
  const [chartOptionsTotalChanges, setChartOptionsTotalChanges] = useState({});
  const [chartOptionsContributors, setChartOptionsContributors] = useState({});
  const [timeRange, setTimeRange] = useState("1year");
  const [selectedView, setSelectedView] = useState("changes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = "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";

        const responseTotal = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency?time_range=${timeRange}`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          }
        );

        const responseContributors = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          }
        );

        const dataTotal = responseTotal.data;
        const dataContributors = responseContributors.data;

        const timestamps = dataTotal.map((item) => {
          const timestamp = item[0] * 1000;
          if (timeRange === "1week") {
            const date = new Date(timestamp);
            date.setUTCHours(0, 0, 0, 0);
            date.setUTCDate(date.getUTCDate() - date.getUTCDay());
            return date.getTime();
          } else if (timeRange === "1month") {
            const date = new Date(timestamp);
            date.setUTCHours(0, 0, 0, 0);
            date.setUTCDate(1);
            return date.getTime();
          }
          return timestamp;
        });

        const weeklyAdditions = dataTotal.map((item) => item[1]);
        const weeklyDeletions = dataTotal.map((item) => item[2]);
        const weeklyChanges = dataTotal.map((item) => item[1] + item[2]);

        const contributorsData = dataContributors.map((contributor) => {
          return {
            name: contributor.author.login,
            data: contributor.weeks.map((week) => week.a + week.d),
          };
        });

        const optionsTotalChanges = {
            chart: {
              type: "line",
              height: "300",
            },
            title: {
              text: `Total Weekly ${selectedView === "changes" ? "Changes" : "Commits"} Activity`,
            },
            xAxis: {
              type: "datetime",
              labels: {
                formatter: function () {
                  return Highcharts.dateFormat("%e %b %Y", this.value);
                },
              },
            },
            yAxis: {
              title: {
                text: "Count",
              },
            },
            tooltip: {
              shared: true,
              formatter: function () {
                const view = selectedView === "changes" ? "Changes" : "Commits";
                let tooltip = `<b>${this.series.name}: ${this.y}</b><br/>${Highcharts.dateFormat(
                  "%e %b %Y",
                  this.x
                )}<br/>${view}: ${this.y}`;
                if (this.series.name === "Deletions") {
                  tooltip = `<b>${this.series.name}: ${-this.y}</b><br/>${Highcharts.dateFormat(
                    "%e %b %Y",
                    this.x
                  )}<br/>${view}: ${-this.y}`;
                }
                return tooltip;
              },
            },
            series: [
              {
                name: "Additions",
                data: timestamps.map((timestamp, index) => [timestamp, weeklyAdditions[index]]),
              },
              {
                name: "Deletions",
                data: timestamps.map((timestamp, index) => [timestamp, -weeklyDeletions[index]]),
              },
            ],
          };
          
        setChartOptionsTotalChanges(optionsTotalChanges);

        const optionsContributors = {
          chart: {
            type: "line",
            height: "300",
          },
          title: {
            text: "Contributors' Weekly Changes",
          },
          xAxis: {
            type: "datetime",
            labels: {
              formatter: function () {
                return Highcharts.dateFormat("%e %b %Y", this.value);
              },
            },
          },
          yAxis: {
            title: {
              text: "Count",
            },
          },
          tooltip: {
            shared: true,
            formatter: function () {
              return `<b>${this.series.name}: ${this.y}</b><br/>${Highcharts.dateFormat(
                "%e %b %Y",
                this.x
              )}<br/>Contributor: ${this.series.name}`;
            },
          },
          series: contributorsData,
        };
        setChartOptionsContributors(optionsContributors);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchData();
  }, [owner, repo, timeRange, selectedView]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleViewChange = (event) => {
    setSelectedView(event.target.value);
  };

  const getTimeRangeLabel = (range) => {
    switch (range) {
      case "1week":
        return "Weekly";
      case "1month":
        return "Monthly";
      case "1year":
        return "Yearly";
      default:
        return "";
    }
  };

  return (
    <div>
      <div style={{padding:"10px 5px"}}>
        <label>
          Select Time Range:{" "}
          <select value={timeRange} onChange={handleTimeRangeChange}>
            <option value="1week">Weekly</option>
            <option value="1month">Monthly</option>
            <option value="1year">Yearly</option>
          </select>
        </label>
        <label>
          Select View:{" "}
          <select value={selectedView} onChange={handleViewChange}>
            <option value="changes">Changes</option>
            <option value="commits">Commits</option>
          </select>
        </label>
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptionsTotalChanges} />
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={chartOptionsContributors} />
      </div>
    </div>
  );
};

export default GithubActivityChart;
