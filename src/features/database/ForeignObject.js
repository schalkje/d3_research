import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as d3 from 'd3';
import { select, selectAll, event } from 'd3-selection'
import { useD3 } from '../../hooks/useD3'
import './databaseStyle.css';
import { dsv } from 'd3';




var width = 600;
var height = 1000;

const radius = 40;
const node_distance = radius * 2;
const link_separator = 4;

const table =
{
    "key": "table01",
    "name": "TableName",
    "documentation_link": "https:\/\/cdm.thefirm.nl\/thefirm\/Domain%20Clients%20report.htm",
    "description": "This table is used for a demonstration of the table functionality.",
    "columns": [
        { "name": "id_table", "type": "int" },
        { "name": "id_table", "type": "int" },
        { "name": "id_table", "type": "int" },
        { "name": "id_table", "type": "int" },
    ]
};

const state_header = 'header' // only the header
const state_columns = 'columns' // show header and columns
const state_keys = 'pk' // show header and columns with pk and fk

let state = state_columns;


function ForeignObject() {
    const dispatch = useDispatch()

    console.log('ForeignObject, state=' + state)

    const ref = useD3(
        (svg) => {
            var container = d3.select('#svg_container')
                .attr("width", "200")
                .attr("height", state == state_header ? "40" : "200")
                .attr("class", "table")
                .on("click", click)


                var background = container
                .append('rect')
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "200")
                .attr("height", state == state_header ? "20" : "200")
                .attr("class", "background")

                // add a tooltip to the background container
                container
                    .append("title")
                    .text("Click to resize");

                var header = container
                .append('rect')
                .attr("x", "2")
                .attr("y", "2")
                .attr("width", "196")
                .attr("height", "36")
                .attr("class", "header")

                var name = container
                .append('text')
                .attr("width", "100%")
                .attr("x", "5")
                .attr("y", "28")
                .attr("class", "name")
                .html("TableName")


                var body = container
                .append('rect')
                .attr("x", "2")
                .attr("y", "36")
                .attr("width", "196")
                .attr("height", "160")
                .attr("class", "body")

                var foreign_body = container
                .append('foreignObject')
                .attr("x", 4)
                .attr("y", 40)
                .attr("width", 192)
                .attr("height", 156)
                
            var div_body = foreign_body
                .append("xhtml:div")
                .attr("class", "body")

            div_body.append("div")
                .attr("class", "column")
                .html("id_table")

            for (let i = 0; i < 30; i++) {
                div_body.append("div")
                .attr("class", "column")
                .html("field " + i)
            }


            // container
            //     .append('text')
            //     .attr("x", "5")
            //     .attr("y", "30")
            //     .attr("class", "column")
            //     .html("id_table")

            // container
            //     .append('text')
            //     .attr("x", "5")
            //     .attr("y", "40")
            //     .attr("class", "column")
            //     .html("id_table")


            // container
            //     .append('text')
            //     .attr("x", "5")
            //     .attr("y", "50")
            //     .attr("class", "column")
            //     .html("number")


            //     container
            //     .append('text')
            //     .attr("x", "5")
            //     .attr("y", "60")
            //     .attr("class", "column")
            //     .html("name")


            //     container
            //     .append('text')
            //     .attr("x", "5")
            //     .attr("y", "70")
            //     .attr("class", "column")
            //     .html("amount")

                
            function click() {
                console.log('click ' + state + ' ---> ')
                if (state == state_header)
                    state = state_columns
                else
                    state = state_header

                container.attr("height", state == state_header ? "40" : "200")
                container.attr("viewBox", state == state_header ? "0 0 200 20" : "0 0 200 200")
                background.attr("height", state == state_header ? "40" : "200")
                // body.attr("visibility",state == state_header ? "hidden":"visible")

                console.log('                 --> ' + state)
            }
        }
    );

    return (
        <svg
            id="svg_container"
            ref={ref}            
            className='table'>
        </svg>
    );
}

export default ForeignObject;


// height={state == state_header?"40":"200"}
// viewBox={state == state_header?"0 0 100 20":"0 0 100 100" } 
