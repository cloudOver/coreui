function TableCoreModel(data, fields, model_name) {
    /*
    data - Response from Core with all fields that are to be shown in table
    fields - fields from response that are be shown in table
    actions - action related to each record. Actions are loaded from separate file in components/[EXTENSION]/actions/[MODEL]
     */
    this.fields = fields;
    this.data = data;
    this.model_name = model_name;

    this.getHeader = function() {
        html = "";

        for (i = 0; i < this.fields.length; i++) {
            html += "<th>" + this.fields[i].charAt(0).toUpperCase() + this.fields[i].slice(1) + "</th>";
        }
        return html;
    };

    this.getRow = function(n) {
        html = "";
        var onclick = "";
        if (this.model_name != null) {
            onclick = " onclick=\"showActions_" + this.model_name + "(" + this.data[n]["id"] + ")\"";
        }
        var css_class = " ";

        if (this.data[n].state == "init" || this.data[n].state == "waiting") {
            css_class = "info";
        } else if (this.data[n].state == "failed") {
            css_class = "danger";
        } else if (this.data[n].state == "stoped") {
            css_class = "default";
        } else if (this.data[n].state == "downloading" || this.data[n].state == "stopping" || this.data[n].state == "starting") {
            css_class = "warning";
        }
        html += "<tr id=\"item_" + this.data[n]["id"] + "\" class='" + css_class + "' " + onclick + ">";

        for (i = 0; i < this.fields.length; i++) {
            if (this.fields[i] == "size") {
                this.data[n][fields[i]] = parseFloat(this.data[n][fields[i]]/1024/1024/1024).toPrecision(2) + " GB";
            }
            html += "<td id=\"item_" + this.data[n]["id"] + "_" + fields[i] + "\">" + this.data[n][fields[i]] + "</td>";
        }
        html += "</tr>";
        html += "<tr><td id='actions_" + this.data[n]["id"] + "' class='hidden " + css_class + "' colspan='" + this.fields.length + "'></td></tr>";
        return html;
    }

}

function SelectCoreModel(data, field) {
    /// This model handles results stored as standard Core model (dictionary)
    this.field = field;
    this.data = data;
    this.getHeader = function () {
        return '';
    };

    this.getRow = function (n) {
        return "<option value=" + this.data[n]['id'] + ">" + this.data[n][this.field] + "</option>";
    }
}

function SelectListModel(data, default_value) {
    /// This model handles results stored as standard Core model (dictionary)
    this.data = data;
    this.default_value = default_value;
    this.getHeader = function () {
        return '';
    };

    this.getRow = function (n) {
        var selected = "";
        if (default_value == this.data[n]) {
            selected = "selected";
        }
        return "<option " + selected + ">" + this.data[n] + "</option>";
    }
}