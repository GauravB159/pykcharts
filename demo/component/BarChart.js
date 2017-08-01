import React, { Component } from 'react';
import { BarChart, Bar, Brush, Cell, CartesianGrid, ReferenceLine, ReferenceDot,
  XAxis, YAxis, Legend, ErrorBar, LabelList,Layer } from 'recharts';
import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import _ from 'lodash';
import { changeNumberOfData } from './utils';

const colors = ["#1515DB", "#2E3CD7", "#4764D3", "#608BD0", "#79B3CC", "#93DBC9"];
const data = [
  {
    "category": "Cattle Protection",
    "count": 70
  },
  {
    "category": "Crime",
    "count": 84
  },
  {
    "category": "Honour Killing",
    "count": 127
  },
  {
    "category": "Other",
    "count": 19
  },
  {
    "category": "Sexual Harrassment",
    "count": 29
  },
  {
    "category": "Witch Craft",
    "count": 22
  }
];

const renderLabelContent = (props) => {
  const { value, percent, x, y, midAngle,dataKey,width,height } = props;

  return (
    <g className="custom-label" transform={`translate(${x+width+20}, ${y+height/2}) rotate(-90)`} textAnchor={ (midAngle < -90 || midAngle >= 90) ? 'end' : 'start'}>
      <text x={0} y={0} style={{fontSize:"9px",fontFamily:"Helvetica"}}>{`${dataKey}`}</text>
      <line x1={0} y1={-15} x2={0} y2={-20} strokeWidth="0.5" stroke="black"></line>
    </g>
  );
};


const initialState = {
  data
};

const CustomTooltip = (props) => {
    const { mouseX,mouseY, payload, label,key,tooltipData,name,value,befData } = props.vals;
    return (
        <div style={{backgroundColor:"white",boxShadow:"2px 2px 1px 0px rgba(0,0,0,0.75)",borderRadius:"5%",pointerEvents:'none',padding:"2px",top:mouseY,left:mouseX,width:"100px",height:"50px",position:"absolute"}}>
          <table style={{backgroundColor:"white",width:"100px",height:"50px"}}>
            <tbody>
              <tr>
                <th  colSpan={2} style={{backgroundColor:"white",border:"1px solid grey",fontSize:"11px",fontFamily:"Helvetica"}}>{key}</th>
              </tr>
              <tr>
                <td style={{backgroundColor:"white",border:"1px solid grey",fontSize:"11px",fontFamily:"Helvetica"}}>{befData[key]}</td>
                <td style={{backgroundColor:"white",border:"1px solid grey",fontSize:"11px",fontFamily:"Helvetica"}}>{tooltipData+"%"}</td>
              </tr>
            </tbody>
          </table>
        </div>
    );
}


class PBChart extends Component {

  constructor(props){
    super(props);
    this.state={
      active:false
    }
  }
  static displayName = 'BarChartDemo';

  state = initialState;
  handleMouseMove = (props,index,key,e)=>{
    let mouseX=e.clientX;
    let mouseY=e.clientY;
    let bar = document.getElementById(key);
    this.setState({
      active:true,
      key:key,
      tooltipData:props[key],
      bar:bar,
      mouseX:mouseX,
      mouseY:mouseY
    });

  }
  handleMouseLeave = ()=>{
    this.setState({
      active:false
    });
  }
  handleChangeData = () => {
    this.setState(() => _.mapValues(initilaState, changeNumberOfData));
  };
  componentWillMount(){
    let dataObj = this.props.data;
    let dat = {};
    let keys = Object.keys(dataObj[0]);
    dat["name"]=keys[0];
    dat["value"]=keys[1];
    dataObj.forEach((val)=>{
      dat[val[keys[0]]]=val[keys[1]];
    });
    let data=[];
    let back=JSON.parse(JSON.stringify(dat));
    data.push(dat);
    this.setState({
      befData:back
    })
    let total = Object.keys( data[0] )
                .reduce( function( sum, key ){
                  if(key === "name"|| key === "value" ) return sum;
                  return sum + parseFloat( data[0][key] );
                }, 0 );


    Object.keys( data[0] )
                .forEach(function( key,index){
                  if(key === "name"|| key === "value") return;
                  data[0][key] = parseFloat(((data[0][key]*100)/total).toFixed(1));
              });

    data[0] = Object.keys(data[0]).filter((key)=> key !== "name" && key !== "value").sort((a, b) => {
                        return data[0][b] - data[0][a] 
                    }).reduce((prev, curr, i) => {
                        prev[curr] = data[0][curr]
                        return prev
                    }, {});
    this.setState({
      total:total,
      data:data,
      name:keys[0],
      value:keys[1]
    })
  }

  componentDidMount(){
    let bars=Array.from(document.getElementsByClassName('recharts-bar'));
    bars.forEach((bar)=>{
      let check = bar.querySelector(".recharts-bar-rectangles").getBoundingClientRect().width;
      let text = bar.querySelector(".custom-label text");
      let comp = text.getBoundingClientRect().width;
      text.setAttribute('x',-comp/2);
      if(comp > check ){
        text.style.fill="none";
        bar.querySelector(".custom-label line").style.stroke="none";
      }
    })
  }

  handleBarAnimationStart = () => {
    console.log('Animation start');
  };

  handleBarAnimationEnd = () => {
    console.log('Animation end');
  };

  render() {
    const { data } = this.state;
    return (
      <div className="bar-charts">
        <br/>
      <p>Percentage Bar Chart</p>
        <div className="bar-chart-wrapper">
          <BarChart width={100} height={500} data={data} horizontal={true} margin={{ top: 0, right: 35, bottom: 35, left: 5 }}>
            {
              Object.keys(data[0]).map((key,index)=>{
                if(key === 'name' || key === 'value') return;
                return(
                    <Bar stackId="0" key={key} dataKey={key} fill={colors[index]} isAnimationActive = {false} label={renderLabelContent} onMouseLeave={this.handleMouseLeave} onMouseMove={this.handleMouseMove}>
                      <LabelList dataKey={key} horizontal={true} perc={true} style={{fontFamily:"Helvetica",fill:"white",fontSize:"9px",pointerEvents:'none'}}/>
                    </Bar>
                );
              })
            }
          </BarChart>
          {this.state.active ? <CustomTooltip vals={this.state}/> : null}
        </div>
      </div>
    );
  }
}

export default class PBarChart extends Component{
  render(){
    return(
      <PBChart data={data}/>
    );
  }
}
