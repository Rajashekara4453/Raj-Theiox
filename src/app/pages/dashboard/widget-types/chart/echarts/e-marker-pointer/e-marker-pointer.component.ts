import { Component, OnInit, Input } from '@angular/core';
import { EchartUtilityFunctions } from '../utilityfunctions';
import { AppService } from '../../../../../../../app/services/app.service';
import { globals } from '../../../../../../utilities/globals';

@Component({
  selector: 'kl-e-marker-pointer',
  templateUrl: './e-marker-pointer.component.html',
  styleUrls: ['./e-marker-pointer.component.scss']
})
export class EMarkerPointerComponent implements OnInit {

  @Input ('chartInfo') chartInfo: object = {};

  public options: any;

  public tempChartInfo = '';

  constructor(
    private _util: EchartUtilityFunctions, private appService: AppService,
    private global:globals
  ) { }

  ngOnInit() {
    this.createOptions();
  }

  ngOnChanges(){
    this.createOptions();
  }
  createOptions(): any {
    const refObj = this;
    if (!this.chartInfo['cData'] || (this.tempChartInfo === JSON.stringify(this.chartInfo['cData'].chartData))) {
      return;
    }
    let showYGrid = true;
    let showXGrid = false;
    if(this.chartInfo['cData']['chartOptions']['grid']){
      showYGrid = this.chartInfo['cData']['chartOptions']['grid']['yGridLine'];
      showXGrid = this.chartInfo['cData']['chartOptions']['grid']['xGridLine'];
    }
    const yaxisInfo = this._util.getYaxisConfig(this.chartInfo['cData']['chartOptions'].yaxis,showYGrid);
    this.chartInfo['cData'].chartData.series = this._util.getSeriesDataUpdatedWithYaxisIndex(this.chartInfo['cData'].chartData.series, yaxisInfo['yAxisIndex']);
    this.chartInfo['cData'].chartData.series = this._util.getMarkPointSeries(this.chartInfo['cData'].chartData.series);
    if (this.chartInfo['cData'].chartOptions.filter.hasOwnProperty('compare') && this.chartInfo['cData'].chartOptions.filter.compare.comparison) {
      if(this.chartInfo['cData'].chartData.hasOwnProperty('series') && this.chartInfo['cData'].chartData.series != undefined && this.chartInfo['cData'].chartData.series.length>0) {
        this.chartInfo['cData'].chartData.series = this._util.assignColorOnlyComparsion(this.chartInfo['cData'].chartData.series);
      }
    } else if(this.chartInfo['cData'].chartData.hasOwnProperty('series') && this.chartInfo['cData'].chartData.series != undefined && this.chartInfo['cData'].chartData.series.length>0) {
      this.chartInfo['cData'].chartData.series = this._util.updateColor(this.chartInfo['cData'].chartData.series,this.global._appConfigurations['colors']);
    }
   
    this.options = {
      grid: {
        containLabel:true
          },     
      xAxis: {
        type: 'category',
        splitLine: {
          show: showXGrid
        },
        name: this._util.getXaxisLabel(this.chartInfo['cData']['chartOptions'].xaxis),
        axisLabel: {
          formatter: function (value, index) {
            return refObj.formatDate(value);
          }
        },
        axisPointer: {
          label: {
            formatter: function (value, index) {
              return refObj.formatDate(value.value);
            },
          },
        },
        data: this.chartInfo['cData'].chartData.category,
      },
      dataZoom: [{
        type: 'inside',
      }],
      tooltip: {
        trigger: 'axis',
        confine:true,
        axisPointer: {
          type: 'cross',
        }
      },
      yAxis: yaxisInfo['yaxis'],
      legend: this._util.getLegendOptions(this.chartInfo['cData']['chartOptions'].legend),
      series: this.chartInfo['cData'].chartData.series,
    };
    this.options['color'] = this._util.colors;
    if (this.chartInfo['cData']['chartOptions'].autoRefreshType && this.chartInfo['cData']['chartOptions'].autoRefreshType === 'realTime') {
      this.options.xAxis.type = 'time'
      delete this.options.xAxis.data;
    }
   if(this.chartInfo['cData'].chartData.hasOwnProperty('series') && this.chartInfo['cData'].chartData.series!= undefined) {
    for (let i = 0; i < this.chartInfo['cData'].chartData.series.length; i++) {
      this.chartInfo['cData'].chartData.series[i].type = 'line';
    }
   }
    this.tempChartInfo = JSON.stringify(this.chartInfo['cData'].chartData);
  }

  // ngDoCheck() {
  //   this.createOptions();
  // }

  formatDate(value) {
    try {
      const cOption = this.chartInfo['cData']['chartOptions'];
      if (!cOption.autoRefreshType || cOption.autoRefreshType !== 'realTime') {
        return value;
      }
      return this._util.getDateTimeFormatted(value, cOption.xaxis.format);
    } catch (error) {
      console.log(error);
      return value;
    }
  }
  getGridOption() {
    let grid: any = {
      containLabel: false,
      left: 50,
      right: 50,
      top: 30,
      bottom: 30,
    }
    const cOption = this.chartInfo['cData']['chartOptions'];
    if (cOption.legend && cOption.legend.show && cOption.legend.position) {
      delete grid[cOption.legend.position]
    }
    return {};
  }
}
