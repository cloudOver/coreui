/*
Copyright (c) 2014-2016 cloudover.io ltd.

This file is part of cloudover.coreCluster project.

cloudover.coreCluster is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function draw_task_graph(element_id, tasks) {
    // Tasks graph
    nodes = [];
    edges = [];

    node_ids = [];
    edges_ids = [];

    // Create list of nodes
    for (i = 0; i < tasks.length; i++) {
        color = '#33ff66';
        if (tasks[i].state == 'failed')
            color = '#ff6633';
        if (tasks[i].state == 'ok')
            color = '#aaa';
        if (tasks[i].state == 'canceled')
            color = '#555';
        if (tasks[i].state == 'waiting')
            color = '#66ff33';

        nodes.push({
            id: tasks[i].id,
            label: tasks[i].type + ':' + tasks[i].action,
            x: Math.random()*4,
            y: i/4,
            shape: 'box',
            color: color,
        });
        node_ids.push(tasks[i].id);
    }

    // Create list of connections
    for (i = 0; i < tasks.length; i++) {
        for (e = 0; e < tasks[i].blockers.length; e++) {
            blocker_id = tasks[i].blockers[e].split(":")[2];
            edge_id = 'edge-' + tasks[i].id + '-' + blocker_id;
            if (node_ids.indexOf(blocker_id) >= 0 && edges_ids.indexOf(edge_id) < 0) {
                edges.push({
                    from: tasks[i].id,
                    to: blocker_id,
                    arrows: 'from',
                });
                edges_ids.push(edge_id);
            }
        }
    }

    var nodes = new vis.DataSet(nodes);
    var edges = new vis.DataSet(edges);
    var container = document.getElementById(element_id);
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        "edges": {
            "smooth": {
                "type": "continuous",
                "forceDirection": "none",
                "roundness": 0.2
            }
        }
    };
    var network = new vis.Network(container, data, options);
}