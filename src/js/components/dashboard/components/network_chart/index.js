import React, { Component } from 'react';

//import vis from '../../../../libs/vis.js';

import dbpedia from '../../../../data/dbpedia';

import SigmaLoaderChild from './sigmaLoaderChild.js';

import { Sigma, RandomizeNodePositions, RelativeSize, ForceAtlas2, NOverlap } from 'react-sigma';
import { indexOfObject } from '../../../../utils/utils';


//tests purpose
// let myGraph = {
//     nodes: [{
//         id: "n1", label: "Alice",
//         "type": "image", "url": "22c656ad5713a5f4d54b9bb698e7d2a5.svg", size: 4, x: 0, y: 0, brito: 2323
//     },
//     { id: "n2", label: "Rabbit", "type": "image", "url": "3207405b9f48818679b024c4df379263.png" }, { id: "ibm", label: "ibm" }],
//     edges: [{ id: "e1", source: "n1", target: "n2", label: "SEES" }, { id: "e2", source: "n1", target: "ibm", label: "SEES" }]
// };

import '../../../../libs/sigmajs/sigma.plugins.dragNodes.min';


import '../../../../../css/vis-my-css.scss';

import facebookIcon from '../../../../../images/network/facebook.png';
import twitterIcon from '../../../../../images/network/twitter.png';
import fileIcon from '../../../../../images/network/file.png';
import articleIcon from '../../../../../images/network/news.png';
import companyIcon from '../../../../../images/network/company.png';
import organizationIcon from '../../../../../images/network/organization.png';
import personIcon from '../../../../../images/network/person.png';
import entityIcon from '../../../../../images/network/entity_target.png';
import keywordIcon from '../../../../../images/network/keyword.png';
import watsonIcon from '../../../../../images/network/logo.png';
import noIcon from '../../../../../images/network/noicon.svg';

const filterDefaults = [
    { label: "Facebook", prop: "facebook", active: true },
    { label: "Twitter", prop: "twitter", active: true },
    { label: "Arquivo", prop: "file", active: true },
    { label: "Artigo", prop: "nodecrawler", active: true },
    { label: "Connections", prop: "connections", active: true },
    { label: "Compania", prop: "company", active: true },
    { label: "Organização", prop: "organization", active: true },
    { label: "Pessoa", prop: "person", active: true },
    // { label: "Entidade", prop: "entity" }
];

class NetworkChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            filter: [],
            graphicData: {},
            nodesBy: {}
        };

        this.chart = null;
        this.modal = null;
        // this.groups = [];
        this.icons = {
            facebook: facebookIcon,
            twitter: twitterIcon,
            file: fileIcon,
            nodecrawler: articleIcon,
            company: companyIcon,
            organization: organizationIcon,
            person: personIcon,
            entity: entityIcon,
            keyword: keywordIcon,
            noicon: noIcon
        };

        this.widgetData = {}; //holds last widget selection data to compare and avoid extra handles
        this.sigma = null;
        this.graphicDataCopy = {}; // it holds copy of graphic data so the filters wont have problems (will compare against this variable)
        this.shouldUpdate = true;

        this.setSigma = this.setSigma.bind(this);
        this.filterNetwork = this.filterNetwork.bind(this);
    }

    getData() {
        let data = this.props.data;

        data.nodes.forEach(node => {
            if (node.group === 'relations') {
                node.group = node.url;
            }
            node.url = this.icons[node.url];
        });

        this.graphicDataCopy = data; // create copy to handle filters
        this.setState({ graphicData: data });
    }


    /**
     * Run though the nodes and check which filter should be available to the user
     * @param  {array} entries Network nodes
     */
    buildFilterOptions(entries) {
        let filter = [];
        let sources = { twitter: false, facebook: false, filecrawler: false, nodecrawler: false, connections: false, organization: false, company: false, person: false };
        let filledFilters = 0;
        let filtersKeysLen = Object.keys(sources).length;
        entries.some((entry, i) => {
            // if (entry.level !== 1) {
            //     return false;
            // }

            if (entry.group === 'relations') {
                entry.group = entry.url;
            }

            let index = -1;
            if (sources[entry.group] === false) {
                filledFilters++;
                sources[entry.group] = true;
                index = indexOfObject(filterDefaults, entry.group, 'prop');
                filter.push(filterDefaults[index]);

                return filledFilters === filtersKeysLen;
            }
        });

        this.setState({ filter });
    }

    componentDidMount() {
        let loaded = 0;
        let self = this;

        // set up filter based on the selected resouces
        this.buildFilterOptions(this.props.data.nodes);

        // abaixo renderer mandatorio para exibicao de imagens nos nodes
        sigma.utils.pkg('sigma.canvas.nodes');
        sigma.canvas.nodes.image = (function () {
            var _cache = {},
                _loading = {},
                _callbacks = {};
            // Return the renderer itself:
            var renderer = function (node, context, settings) {
                var args = arguments,
                    prefix = settings('prefix') || '',
                    size = node[prefix + 'size'],
                    color = node.color || settings('defaultNodeColor'),
                    url = node.url;
                if (_cache[url]) {
                    context.save();
                    // Draw the clipping disc:
                    context.beginPath();
                    context.arc(
                        node[prefix + 'x'],
                        node[prefix + 'y'],
                        node[prefix + 'size'],
                        0,
                        Math.PI * 2,
                        true
                    );
                    context.closePath();
                    context.clip();
                    // Draw the image
                    context.drawImage(
                        _cache[url],
                        node[prefix + 'x'] - size,
                        node[prefix + 'y'] - size,
                        2 * size,
                        2 * size
                    );
                    // Quit the "clipping mode":
                    context.restore();
                    // Draw the border:
                    context.beginPath();
                    context.arc(
                        node[prefix + 'x'],
                        node[prefix + 'y'],
                        node[prefix + 'size'],
                        0,
                        Math.PI * 2,
                        true
                    );
                    context.lineWidth = size / 5;
                    context.strokeStyle = node.color || settings('defaultNodeColor');
                    context.stroke();
                } else {
                    sigma.canvas.nodes.image.cache(url);
                    sigma.canvas.nodes.def.apply(
                        sigma.canvas.nodes,
                        args
                    );
                }
            };
            // Let's add a public method to cache images, to make it possible to
            // preload images before the initial rendering:
            renderer.cache = function (url, callback) {
                if (callback)
                    _callbacks[url] = callback;
                if (_loading[url])
                    return;
                var img = new Image();
                img.onload = function () {
                    _loading[url] = false;
                    _cache[url] = img;
                    if (_callbacks[url]) {
                        _callbacks[url].call(this, img);
                        delete _callbacks[url];
                    }
                };
                _loading[url] = true;
                img.src = url;
            };
            return renderer;
        })();


        let iconsSize = Object.keys(this.icons).length;
        // iterate over images to make sure all are cached before present the graphic
        function cb() {
            if (++loaded === iconsSize) {
                self.getData();
                // self.modalMount();
                self.setState({ ready: true });
            }
        }

        for (var icon in this.icons) {
            if (this.icons.hasOwnProperty(icon)) {
                let element = this.icons[icon];
                sigma.canvas.nodes.image.cache(element, cb);
            }
        }

        // for (let icon in this.icons) {
        //     sigma.canvas.nodes.image.cache(this.icons[icon], cb);
        // }
    }

    shouldComponentUpdate() {
        return this.shouldUpdate;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updatesOnCorrelation > this.props.updatesOnCorrelation) {
            this.widgetData = nextProps.selectedWidgetItem;
            this.shouldUpdate = true;

            if (this.sigma) {
                let nodesToBeSelected = [];
                // find all keyword nodes that has the same keyword selected from the word cloud
                if (this.widgetData.keyword && this.widgetData.from === 'trends')
                    nodesToBeSelected = this.sigma.graph.nodes().filter(node => {
                        return (node.group && node.group === 'keywords' && node.label.toLowerCase() === this.widgetData.keyword.toLowerCase());
                    })

                // select all level 1 (face, tweet, etc) nodes that has the same ID that generated the clicked word cloud
                if (this.widgetData.from === 'time_line')
                    nodesToBeSelected = nodesToBeSelected.concat(
                        this.sigma.graph.nodes().filter(item => {
                            let index = indexOfObject(this.widgetData.selectedItems, item.id, '_id');
                            return (item.level == 1 && index > -1);
                        })
                    );

                nodesToBeSelected.forEach(node => {
                    if (!node.isSelected) {
                        node.isSelected = true;
                        node.color = "#ff0000";
                        this.sigma.camera.goTo({
                            x: node["read_cam0:x"],
                            y: node["read_cam0:y"],
                            angle: 0,
                            ratio: 0.4
                        });

                    } else {
                        node.isSelected = false;
                        node.color = "#4a4a4a";
                    }
                });

                this.sigma.refresh();
                this.shouldUpdate = false;
            }
        } else {
            this.shouldUpdate = false;
        }
    }

    modalMount() {
        var that = this;
        // that.modal = modalBox();
        // return function () {
        //     that.modal({ content: '<div id="networkChart2"></div>', classes: "full" });
        //     that.create('networkChart2');
        // }
    };

    create(tag) { //create vis
        // console.log(tag);
        //this.state.config.layout.improvedLayout = false;


    };

    update(tipo, data) {
        var result = {
            egdes: [],
            nodes: []
        };
        result = {};
        result.edges = [];
        result.nodes = [];
        var edge = {};
        var nodes = {};
        var nodesToBeRemoved = {};
        var edgesToBeRemoved = {};
        // remove os nos tipo x
        data.nodes.forEach(node => {
            if (node.group != tipo) {
                result.nodes.push(node);
            } else if (!nodesToBeRemoved[node.id]) {
                nodesToBeRemoved[node.id] = 1;
            }

        });
        // remove os edges ligados diretamente em node do tipo x
        data.edges.forEach(edge => {
            if (!nodesToBeRemoved[edge.source] && !nodesToBeRemoved[edge.target]) {  //se nao se encontra em um dos nodes que tem que ser removidos, adciona o edge
                result.edges.push(edge);
            }

        });

        data.edges.forEach(edge => {  //itera novamente os edges para descobrir qual tinha ligacao com os nodes que foram removidos
            if (!edgesToBeRemoved[edge.target])
                edgesToBeRemoved[edge.target] = { quantRemoved: 0, quantNaoRemoved: 0 };
            if (nodesToBeRemoved[edge.source])
                edgesToBeRemoved[edge.target].quantRemoved++;
            else edgesToBeRemoved[edge.target].quantNaoRemoved++;
        });

        var finalNodesToBeDeleted = [];

        data.nodes.forEach(node => {
            if ((edgesToBeRemoved[node.id] && edgesToBeRemoved[node.id].quantRemoved > 0 && edgesToBeRemoved[node.id].quantNaoRemoved == 0))
                finalNodesToBeDeleted.push(node);
        });

        finalNodesToBeDeleted.forEach(function (node) {
            result.nodes.splice(result.nodes.indexOf(node), 1)
        });

        return result;
    }

    /**
     * Active/Inactive an filter options and filter the network chart based on it
     * @param {Object} selectedOption Filter item
     * @param {number} index Index of the selected filter option
     */
    filterNetwork(selectedOption, index) {
        let filter = this.state.filter;
        filter[index].active = !filter[index].active;
        this.shouldUpdate = true;

        this.setState({ ready: false, filter }, () => {
            let filteredData = this.props.data;
            // iterate though filter options to remove nodes of inactive options
            filter.forEach((option, index) => {
                if (!option.active) {
                    filteredData = this.update(option.prop, filteredData);
                }
            }, this);

            this.shouldUpdate = true;
            this.setState({ graphicData: filteredData }, () => {
                this.setState({ ready: true });
            });
        });
    }

    createFilterComponent() {
        return this.state.filter.map((option, index) => {
            return (
                <div key={index} onClick={e => { this.filterNetwork(option, index) }} className={option.active ? '' : 'inactive'}>
                    <span className="icon"></span>
                    <span>{option.label}</span>
                </div>
            )
        }, this)
    }

    setSigma(sigma) {
        this.sigma = sigma;
    }

    render() {
        return (
            <div className='networkChart widgetContentNetworkChart'>
                <div className="vis-group-controls">
                    { this.createFilterComponent() }
                </div>
                <div><br />
                    {
                        !this.state.ready ? null :
                            <Sigma renderer="canvas" graph={this.state.graphicData}
                                settings={{
                                    clone: true,
                                    defaultNodeType: 'image',
                                    maxNodeSize: 10,
                                    autoRescale: true,
                                    verbose: true,
                                    defaultLabelColor: '#7c8282',
                                    labelColor: '#7c8282',
                                    enableEdgeHovering: false,
                                    animationsTime: 3000,
                                    nodeHoverBorderSize: 10,
                                    borderSize: 1,
                                    defaultNodeHoverBorderColor: '#ffffff',
                                    defaultNodeColor: '#4a4a4a'
                                }}
                                style={{ width: "100%", height: "90%", position: "absolute" }}
                                onClickNode={this.props.node}>
                                <RandomizeNodePositions>
                                    <ForceAtlas2 gravity={1} adjustSizes={false} scalingRation={0.2}
                                        worker barnesHutOptimize
                                        barnesHutTheta={0.6} iterationsPerRender={1} linLogMode={true} timeout={10000} />
                                    <NOverlap nodeMargin={3} scaleNodes={1.3} />
                                </RandomizeNodePositions>
                                <SigmaLoaderChild setSigma={this.setSigma} />

                            </Sigma>
                    }
                </div>
            </div>

        );
    };
}
//<RandomizeNodePositions/>
//<RelativeSize initialSize={15}/>
//old onClickNode function: nodeClicked.bind(this)
//{/* <NOverlap nodeMargin={3} scaleNodes={1.3} /> */}
//<ForceAtlas2 gravity={1} adjustSizes={false} scalingRation={0.2} worker barnesHutOptimize barnesHutTheta={0.6} iterationsPerRender={10} linLogMode timeout={3000}/>
//<div  onClick={() => {setCamera("ibm")}}>node 1</div>           
export default NetworkChart;