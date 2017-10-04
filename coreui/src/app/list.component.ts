import { Component } from '@angular/core';


export class Header {
    display_name: string;
    key_name: string;
}

export class Item {
    values: string[];
}

ITEMS : Item[] = [

]

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent {
    title = 'default list';
    list_url = '/api/test/get_list/';
    edit_url = '/api/test/edit/'
    headers = ['First column', 'Second column', '...'];
    items = null;
    autorefresh = false;
}
