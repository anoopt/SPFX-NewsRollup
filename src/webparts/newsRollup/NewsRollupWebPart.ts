import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-client-preview';


import styles from './NewsRollup.module.scss';
import * as strings from 'newsRollupStrings';
import { INewsRollupWebPartProps } from './INewsRollupWebPartProps';
import MockHttpClient from './MockHttpClient';
import { EnvironmentType } from '@microsoft/sp-client-base';
import importableModuleLoader from '@microsoft/sp-module-loader';

export interface INewsItems {
    value: INewsItem[];
}

export interface INewsItem {
    ImageUrl: any;
    Title: string;
    Byline: string;
    Id: number;
}

export default class NewsRollupWebPart extends BaseClientSideWebPart<INewsRollupWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
    //importableModuleLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
  }

  private _getMockListData(): Promise<INewsItems> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
        .then((data: INewsItem[]) => {
             var listData: INewsItems = { value: data };
             return listData;
         }) as Promise<INewsItems>;
  }

  private _getListData(): Promise<INewsItems> {
  return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/lists/getbytitle('News')/items?$select=Id,ImageUrl,Title,Byline`)
          .then((response: Response) => {
            return response.json();
          });
  }

  private _renderNewsAsync(): void {
    // Local environment
    if (this.context.environment.type === EnvironmentType.Local) {
        this._getMockListData().then((response) => {
        this._renderNews(response.value);
        }); }
        else {
        this._getListData()
        .then((response) => {
            this._renderNews(response.value);
        });
    }
  }

  private _renderNews(items: INewsItem[]): void {
    let html: string = '';
    items.forEach((item: INewsItem, index: number) => {
        console.log(index);
        if((index+1) <= this.properties.items)
        {
          //html += `
              //<li class="ms-ListItem">
                  //<span class="ms-ListItem-primaryText">${item.Title}</span>
                  //<img class="${styles.newsImage}" src="${item.ImageUrl.Url}" />
              //</li>`;
          html += `<div class="ms-Persona">
                      <div class="ms-Persona-imageArea ${styles.noBorderRadius}">
                          <img class="ms-Persona-image ${styles.noBorderRadius}" src="${item.ImageUrl.Url}">
                      </div>
                      <div class="ms-Persona-details">

                          <div class="ms-Persona-primaryText">${item.Title}</div>
                          <div class="ms-Persona-secondaryText">${item.Byline}</div>
                      </div>
                    </div>
                    <br/>`;
        }
    });

    const newsItemsHolder: Element = this.domElement.querySelector('#newsItems');
    newsItemsHolder.innerHTML = html;
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.newsRollup}">
        <div class="${styles.container}">
          <p class="ms-font-l ms-fontColor-black">${this.properties.description}</p>
          <div id="newsItems" />
          </div>
        </div>
      </div>`;
      this._renderNewsAsync();
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneSlider('items', {
                  label: 'Number of items',
                  min: 1,
                  max: 10
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
