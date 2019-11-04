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
    database: '',
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
  private _general = (
    <React.Fragment>
      <FormGroup label='User:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          onChange={e => this.props.onUpdate('user', e.target.value)}
        />
      </FormGroup>

      <FormGroup label='Password:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          placeholder='<hidden>'
          onChange={e => this.props.onUpdate('password', e.target.value)}
        />
      </FormGroup>

      <FormGroup label='Database:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          onChange={e => this.props.onUpdate('database', e.target.value)}
        />
      </FormGroup>
    </React.Fragment>
  );

  private _SSL = (
    <React.Fragment>
      SSL
    </React.Fragment>
  );

  private _categories: Tabs.ITab[] = [
    {
      tabId: 'general',
      title: 'General',
      panel: this._general,
    },
    {
      tabId: 'ssl',
      title: 'SSL',
      panel: this._SSL,
    },
  ];

  private _panel = (
    <div className='m-NewConnectionDialog-panel'>
      <FormGroup label='Name:' inline={true}>
        <InputGroup
          type='text'
          fill={true}
          onChange={e => this.props.onUpdate('name', e.target.value)}
        />
      </FormGroup>

      <Tabs
        id='m-newconnection-dialog-categories'
        onChange={() => ({})}
        tabs={this._categories}
      />
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
    return (
      <Tabs
        id='m-newconnection-dialog'
        vertical={true}
        onChange={(id: string) => this.props.onUpdate('type', id)}
        tabs={this._tabs}
      />
    );
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
    database: string;
  }
}
