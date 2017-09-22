import React from 'react';


import Home from '../components/Home';

class Page1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<If condition={true}>
					这是一个测试文字
				</If>
				<Home />
			</div>
		);
	}
}

export default Page1;