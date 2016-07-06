"use strict";

import React from 'react';
import Falcor from 'falcor';
import falcorModel from '../falcorModel.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import articleActions from '../actions/article.js';
import ArticleCard from '../components/ArticleCard';
import ReactS3Uploader from 'react-s3-uploader';


const mapStateToProps = (state) => ({
	...state
});

const mapDispatchToProps = (dispatch) => ({
  articleActions: bindActionCreators(articleActions, dispatch)
});

class PublishingApp extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    if(typeof window !== 'undefined') {
      this._fetch(); // we are server side rendering, no fetching
    }
  }

  async _fetch() {
    let articlesLength = await falcorModel.
      getValue("articles.length").
      then(function(length) {  
        return length;
      });

    let articles = await falcorModel.
      get(['articles', {from: 0, to: articlesLength-1}, ['_id', 'articleTitle', 'articleSubTitle','articleContent', 'articleContentJSON', 'articlePicUrl']]). 
      then((articlesResponse) => {  
        return articlesResponse.json.articles;
      }).catch(e => {
        console.debug(e);
        return 500;
      });

    if(articles === 500) {
      return;
    }

    this.props.articleActions.articlesList(articles);
  }

  render () {
    let articlesJSX = [];

    console.info(this.props.article);
    console.info('console.info(this.props.article);');
    console.info(typeof this.props.article);
    console.info('111', this.props.article.get);
    console.info('222', this.props.article.forEach);

    this.props.article.forEach((articleDetails, articleKey) => {
      let currentSubTitle = typeof articleDetails.articleSubTitle !== 'undefined' ? articleDetails.articleSubTitle : '';
      let currentArticleJSX = (
        <div key={articleKey}>
          <ArticleCard 
            title={articleDetails.articleTitle}
            subTitle={currentSubTitle}
            content={articleDetails.articleContent} 
            articlePicUrl={articleDetails.articlePicUrl} />
        </div>
      );

      articlesJSX.push(currentArticleJSX);
    });

    return (
      <div style={{height: '100%', width: '75%', margin: 'auto'}}>
          {articlesJSX}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishingApp);