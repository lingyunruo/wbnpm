import React from 'react';
import {render} from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';

import Page1 from '../page/page1';


class RouterWrap extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={Page1} />
				</div>
			</HashRouter>
		);
	}
}

render(<RouterWrap />, document.getElementById('root'));

