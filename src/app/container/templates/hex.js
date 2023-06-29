import Hex from '../Hex';

/**
 *
 * @param {Hex} hex
 */
const renderHex = hex => {
    const html = `
        <div class="field">
            <label class="label">Name</label>
            <div class="control">
                <input class="input" type="text" placeholder="Hex Name" id="name">
            </div>
        </div>
    `

    const parent = document.createElement('div');
    parent.innerHTML = html;

    const nameInput = parent.querySelector('#name');
    nameInput.value = hex.name;
    nameInput.oninput = () => {
        hex.name = nameInput.value;
    };

    return parent.querySelectorAll('*');
}

export default renderHex;
