import React from 'react';


import Home from '../components/Home';
import Page from '../components/Page';
import Detail from '../components/Detail';


class Page1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Home />
				<Page />
				<Detail />
			</div>
		);
	}
}

export default Page1;