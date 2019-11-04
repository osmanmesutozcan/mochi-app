import * as React from 'react';

import { Dialog, ReactWidget } from '@mochi/apputils';
import { FormGroup, InputGroup, Tabs } from '@mochi/ui-components';

import { DatabaseBrowserModel } from './model';

export class NewConnectionDialogBody extends ReactWidget implements Dialog.IBodyWidget<BrowserDialog.INewConnection> {
  constructor(private readonly options: NewConnectionDialogBody.IOptions) {
    super();
  }

  getValue(): BrowserDialog.INewConnection {
    return this._value;
  }

  render() {
    return <NewConnectionDialog model={this.options.model} onUpdate={(p, v) => this._updateValue(p, v)} />;
  }

  private _updateValue(property: keyof BrowserDialog.INewConnection, value: string): void {
    this._value[property] = value;
  }

  /**
   * Default values for new connection...
   */
  private _value: BrowserDialog.INewConnection = {
    type: '',
    name: '',
    user: '',
    password: '',
  };
}

export namespace NewConnectionDialogBody {
  export interface IOptions {
    model: DatabaseBrowserModel;
  }
}

/**
 * Body of new connection dialog.
 */
class NewConnectionDialog extends React.Component<NewConnectionDialog.IProps> {
  private _panel = (
    <div className='m-NewConnectionDialog-panel'>
      <FormGroup label='Settings'>
        <InputGroup type='text' placeholder='Name' onChange={e => this.props.onUpdate('name', e.target.value)} />
      </FormGroup>
      <FormGroup label='Auth'>
        <InputGroup type='text' placeholder='User' onChange={e => this.props.onUpdate('user', e.target.value)} />
        <InputGroup type='text' placeholder='Password' onChange={e => this.props.onUpdate('password', e.target.value)} />
      </FormGroup>
    </div>
  );

  private _tabs: Tabs.ITab[] = [
    {
      tabId: 'msql',
      title: 'Mysql',
      panel: this._panel,
    },
    {
      tabId: 'pg',
      title: 'Postgres',
      panel: this._panel,
    },
    {
      tabId: 'rds',
      title: 'Redis',
      panel: this._panel,
    },
    {
      tabId: 'mongodb',
      title: 'MongoDB',
      panel: this._panel,
    },
    {
      tabId: 'elastic',
      title: 'ElasticSearch',
      panel: this._panel,
    },
  ];

  public render() {
    return <Tabs
      vertical={true}
      className='m-NewConnectionDialog'
      id='m-newconnection-dialog'
      onChange={(id: string) => this.props.onUpdate('type', id)}
      tabs={this._tabs}
    />;
  }
}

namespace NewConnectionDialog {
  export interface IProps {
    model: DatabaseBrowserModel;
    onUpdate(property: keyof BrowserDialog.INewConnection, value: string): void;
  }
}

export namespace BrowserDialog {
  export interface INewConnection {
    name: string;
    type: string;
    user: string;
    password: string;
  }
}
