import css from './CheckBox.module.css'
const CheckBox = (props) => {
    
    return(<div class={css.checkboxWrapper}>
                <input type="checkbox" checked={props.value} onChange={(e) => {props.onCheck(e.currentTarget.checked)}} class={css.checkBox} />
            </div>)
}

export default CheckBox