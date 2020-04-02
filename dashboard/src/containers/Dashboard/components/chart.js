import React from "react";
import {
  VictoryChart,
  VictoryGroup,
  VictoryTooltip,
  VictoryLine,
  VictoryScatter,
  VictoryBrushContainer,
  VictoryAxis,
  createContainer,
} from "victory";
import dayJS from "dayjs";

import GridContainer from "../../shared/Grid/GridContainer";
import GridItem from "../../shared/Grid/GridItem";

import { darkThemePalette } from "../../../../theme/palette";

import useDashboardChart from "../../../hooks/dashboard-chart";

function DashboardChart(props) {
  const { cases, deaths, recovered } = props;

  const {
    data,
    totalCasesZoomDomain,
    handleTotalCases,
    getData,
  } = useDashboardChart(cases, deaths, recovered);

  const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

  return (
    <GridContainer
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <GridItem xs={12} sm={12} md={9}>
        <VictoryChart
          theme={{
            axis: {
              style: {
                axis: { stroke: darkThemePalette.gray },
                tickLabels: {
                  fontSize: 7,
                  padding: 5,
                  fill: darkThemePalette.gray,
                },
                axisLabel: { fontSize: 12, padding: 30 },
                grid: { stroke: darkThemePalette.primary.white },
              },
            },
          }}
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension="x"
              zoomDomain={totalCasesZoomDomain}
              onZoomDomainChange={handleTotalCases}
            />
          }
          scale={{ x: "time" }}
        >
          {data.map(({ label, chartData, chartZoom, color }) => (
            <VictoryGroup
              key={label}
              labels={({ datum }) => `${label}: ${datum.y}`}
              data={chartData}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{
                    stroke: color,
                    fill: "white",
                  }}
                  style={{ fontSize: 8, fill: darkThemePalette.gray }}
                />
              }
            >
              <VictoryLine
                style={{
                  data: {
                    stroke: color,
                    strokeWidth: 1,
                  },
                }}
              />
              <VictoryScatter
                data={getData(chartZoom, chartData)}
                style={{ data: { fill: color } }}
                size={({ active }) => (active ? 2 : 2)}
              />
            </VictoryGroup>
          ))}
        </VictoryChart>
        <VictoryChart
          padding={{ top: 0, left: 50, right: 50, bottom: 50 }}
          height={100}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={totalCasesZoomDomain}
              onBrushDomainChange={handleTotalCases}
            />
          }
        >
          <VictoryAxis
            style={{
              axis: { stroke: darkThemePalette.gray },
              tickLabels: {
                fontSize: 7,
                padding: 5,
                fill: darkThemePalette.gray,
              },
              axisLabel: {
                fontSize: 12,
                fill: darkThemePalette.gray,
              },
            }}
            tickFormat={(x) => {
              return dayJS(x).format("MMM DD");
            }}
          />
          {data.map(({ label, chartData, color }) => (
            <VictoryLine
              key={label}
              style={{
                data: { stroke: color, strokeWidth: 1 },
              }}
              data={chartData}
            />
          ))}
        </VictoryChart>
      </GridItem>
    </GridContainer>
  );
}

export default DashboardChart;
