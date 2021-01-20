/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

//import { ListBox, ListBoxItemSpec } from '@ephox/bridge/src/main/ts/ephox/bridge/api/Dialog';
import { Optional } from '@ephox/katamari';
import Promise from 'tinymce/core/api/util/Promise';
import XHR from 'tinymce/core/api/util/XHR';
//import * as Settings from '../../api/Settings';
//import { ListOptions } from '../../core/ListOptions';
import { ListItem, UserListItem } from '../DialogTypes';

const parseJson = (text: string): Optional<ListItem[]> => {
  // Do some proper modelling.
  try {
    return Optional.some(JSON.parse(text));
  } catch (err) {
    return Optional.none();
  }
};

const getLinks = (editor): Promise<Optional<ListItem[]>> => {
  //const extractor = (item) => item;//editor.convertURL(item.value || item.url, 'href');

  return new Promise<Optional<UserListItem[]>>((callback) => {
    XHR.send({
      url: 'https://app.productfruits.com/api/v1/tours/yiRkZaruvpA-H2sy', //'/api/v1/tours/' + window['auth'].project.UniqueCode,
      success: (text) => callback(parseJson(text)),
      error: (_) => callback(Optional.none()),
      crossDomain: true
    });
  }).then((optItems) => {
    const noneItem: ListItem[] = [{ text: 'None', value: '' }];

    const data: any = optItems.getOrNull();

    return Optional.from(noneItem.concat(data.items.map(i => { return { text: i.name, value: i.id.toString() } })));
  });
  /*.then((optItems) => optItems.bind(ListOptions.sanitizeWith(extractor)).map((items) => {
    console.log('AA', items);
    if (items.length > 0) {
      const noneItem: ListItem[] = [{ text: 'None', value: '' }];
      return noneItem.concat(items);
    } else {
      return items;
    }
  }));*/
};

export const ToursListOptions = {
  getLinks
};
