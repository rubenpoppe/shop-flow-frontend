import { Button, ButtonGroup } from '@material-ui/core';

export default function Incrementer(props) {
	return (
		<ButtonGroup>
			<Button
				disabled={props.count === 1}
				onClick={(e) => {
					props.onChange(props.count - 1);
					e.target.blur();
				}}
			>
				-
			</Button>
			<Button disabled>{props.count}</Button>
			<Button
				disabled={props.count === 99}
				onClick={(e) => {
					props.onChange(props.count + 1);
					e.target.blur();
				}}
			>
				+
			</Button>
		</ButtonGroup>
	);
}
