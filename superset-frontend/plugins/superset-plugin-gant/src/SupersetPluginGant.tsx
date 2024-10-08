/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from 'react';
import { styled } from '@superset-ui/core';
import {Category, SupersetPluginGantProps, SupersetPluginGantStylesProps} from './types';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts
// @ts-ignore
const Styles = styled.div<SupersetPluginGantStylesProps>`
  background-color: ${({ theme }) => theme.colors.secondary.light2};
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? 'bold' : 'normal']};
  }

  pre {
    height: ${({ theme, headerFontSize, height }) =>
      height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginGant(props: SupersetPluginGantProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, startDate, endDate, cols } = props;

  const categories: Set<Category> = Object.assign([...Array.from(new Set(data.map(name => name[cols])), v => ({category:v}))]);

  let start: string = '';
  let end: string = '';

  if (typeof startDate === 'object'){
    start = startDate['label']
  }
  else {
    start = startDate;
  }

  if (typeof endDate === 'object'){
    end = endDate['label'];
  }
  else {
    end = endDate;
  }

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    //const root = rootElem.current as HTMLElement;
    var root = am5.Root.new("chart");

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX", "openValueX"]
    });


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 0,
      layout: root.verticalLayout
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    // @ts-ignore
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }))

    let colors = chart.get("colors");
    let arrCategory = [...categories];
  // @ts-ignore
    const dataChart = data.map((v, i) => ({
      category: v[cols],
      // @ts-ignore
      start: new Date(v[start]).getTime(),
      // @ts-ignore
      end: new Date(v[end]).getTime(),
      columnSettings: {
          fill: am5.Color.brighten(
              // @ts-ignore
              colors.getIndex(arrCategory.findIndex(x => x.category === v[cols])), 0)
      },
    }));
    console.log(dataChart);
/*
    // Data
    let data = [{
      category: "Module #1",
      start: new Date(2016, 0, 1).getTime(),
      end: new Date(2016, 0, 14).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(0), 0)
      },
      task: "Gathering requirements"
    }, {
      category: "Module #1",
      start: new Date(2016, 0, 16).getTime(),
      end: new Date(2016, 0, 27).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(0), 0.4)
      },
      task: "Producing specifications"
    }, {
      category: "Module #1",
      start: new Date(2016, 1, 5).getTime(),
      end: new Date(2016, 3, 18).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(0), 0.8)
      },
      task: "Development"
    }, {
      category: "Module #1",
      start: new Date(2016, 3, 18).getTime(),
      end: new Date(2016, 5, 1).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(0), 1.2)
      },
      task: "Testing and QA"
    }, {
      category: "Module #2",
      start: new Date(2016, 0, 8).getTime(),
      end: new Date(2016, 0, 10).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(2), 0)
      },
      task: "Gathering requirements"
    }, {
      category: "Module #2",
      start: new Date(2016, 0, 12).getTime(),
      end: new Date(2016, 0, 15).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(2), 0.4)
      },
      task: "Producing specifications"
    }, {
      category: "Module #2",
      start: new Date(2016, 0, 16).getTime(),
      end: new Date(2016, 1, 5).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(2), 0.8)
      },
      task: "Development"
    }, {
      category: "Module #2",
      start: new Date(2016, 1, 10).getTime(),
      end: new Date(2016, 1, 18).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(2), 1.2)
      },
      task: "Testing and QA"
    }, {
      category: "Module #3",
      start: new Date(2016, 0, 2).getTime(),
      end: new Date(2016, 0, 8).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(4), 0)
      },
      task: "Gathering requirements"
    }, {
      category: "Module #3",
      start: new Date(2016, 0, 8).getTime(),
      end: new Date(2016, 0, 16).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(4), 0.4)
      },
      task: "Producing specifications"
    }, {
      category: "Module #3",
      start: new Date(2016, 0, 19).getTime(),
      end: new Date(2016, 2, 1).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(4), 0.8)
      },
      task: "Development"
    }, {
      category: "Module #3",
      start: new Date(2016, 2, 12).getTime(),
      end: new Date(2016, 3, 5).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(4), 1.2)
      },
      task: "Testing and QA"
    }, {
      category: "Module #4",
      start: new Date(2016, 0, 1).getTime(),
      end: new Date(2016, 0, 19).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(6), 0)
      },
      task: "Gathering requirements"
    }, {
      category: "Module #4",
      start: new Date(2016, 0, 19).getTime(),
      end: new Date(2016, 1, 3).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(6), 0.4)
      },
      task: "Producing specifications"
    }, {
      category: "Module #4",
      start: new Date(2016, 2, 20).getTime(),
      end: new Date(2016, 3, 25).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(6), 0.8)
      },
      task: "Development"
    }, {
      category: "Module #4",
      start: new Date(2016, 3, 27).getTime(),
      end: new Date(2016, 4, 15).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(6), 1.2)
      },
      task: "Testing and QA"
    }, {
      category: "Module #5",
      start: new Date(2016, 0, 1).getTime(),
      end: new Date(2016, 0, 12).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(8), 0)
      },
      task: "Gathering requirements"
    }, {
      category: "Module #5",
      start: new Date(2016, 0, 12).getTime(),
      end: new Date(2016, 0, 19).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(8), 0.4)
      },
      task: "Producing specifications"
    }, {
      category: "Module #5",
      start: new Date(2016, 0, 19).getTime(),
      end: new Date(2016, 2, 1).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(8), 0.8)
      },
      task: "Development"
    }, {
      category: "Module #5",
      start: new Date(2016, 2, 8).getTime(),
      end: new Date(2016, 2, 30).getTime(),
      columnSettings: {
        fill: am5.Color.brighten(colors.getIndex(8), 1.2)
      },
      task: "Testing and QA"
    }];

*/
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    let yRenderer = am5xy.AxisRendererY.new(root, {
      minorGridEnabled: true,
      minorLabelsEnabled: true,
      nonScalingStroke: true,
      minHeight: 20
    });
    yRenderer.grid.template.set("location", 1);

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {})

      })
    );

    // @ts-ignore
    yAxis.data.setAll(categories);
    // @ts-ignore
    yAxis.zoomToIndexes(categories.length, categories.length - 10);

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "day", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minorGridEnabled: true,
          minGridDistance: 80
        })
      })
    );


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      openValueXField: "start",
      valueXField: "end",
      categoryYField: "category",
      sequencedInterpolation: true
    }));

    series.columns.template.setAll({
      templateField: "columnSettings",
      strokeOpacity: 0,
      tooltipText: "{task}:\n[bold]{openValueX}[/] - [bold]{valueX}[/]"
    });
    console.log(dataChart);
    series.data.setAll(dataChart);

    // Add scrollbars
    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
    chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical",}));
    let scrollY = chart.get("scrollbarY");
    // @ts-ignore
    scrollY.startGrip.setAll({
      visible: false,
      x: 100
    });

    // @ts-ignore
    scrollY.endGrip.setAll({
      visible: false,
      dy: 100
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
    chart.appear(1000, 100);

    return() =>{
      root.dispose();
    };
  });

  console.log('Plugin props', props);

  return (
      <div
      ref={rootElem}
      style={{width: width, height: height}}
      id="chart"
    ></div> /*
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}

    >
      <h3>{props.headerText}</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </Styles>*/
  );
}
