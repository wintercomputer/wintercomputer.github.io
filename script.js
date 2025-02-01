const original_skin = document.getElementById('base_skin');
const edited_skin = document.getElementById('skin');
const edited_skin_preview = document.getElementById('current_skin');

const original_skin_ctx = original_skin.getContext('2d');
const edited_skin_ctx = edited_skin.getContext('2d');
const edited_skin_preview_ctx = edited_skin_preview.getContext('2d');

const skin_input = document.getElementById('skin_input');

skin_input.addEventListener('change', async function(event) {
    
    await draw_base_skin(original_skin_ctx);
    await draw_finished_skin(edited_skin_ctx);
    await draw_finished_skin(edited_skin_preview_ctx);
});

const draw_base_skin = async (canvas_ctx) => {
    return new Promise((resolve, reject) => {
        let imported_skin = skin_input.files[0];
        let reader = new FileReader();

        reader.onload = (event) => {
            let skin_image = new Image();
            skin_image.src = event.target.result;

            skin_image.onload = function () {
                canvas_ctx.clearRect(0, 0, original_skin.width, original_skin.height);
                canvas_ctx.drawImage(skin_image, 0, 0);
                canvas_ctx.imageSmoothingEnabled = false;
                resolve();
            };

            skin_image.onerror = reject;
        };

        reader.onerror = reject;
        reader.readAsDataURL(imported_skin);
    });
};

const draw_finished_skin = async (canvas_ctx) => {
    await draw_base_skin(canvas_ctx);

    let elements = document.getElementById('elements');
    let selected_elements = Array.from(elements.getElementsByClassName('selected_element'));

    for (let element of selected_elements) {
        await new Promise((resolve, reject) => {
            let image = new Image();
            image.src = element.getElementsByClassName('element_link_storage')[0].href;

            image.onload = function() {
                canvas_ctx.drawImage(image, 0, 0);
                canvas_ctx.imageSmoothingEnabled = false;
                resolve();
            };

            image.onerror = reject;
        });
    }
};


const skin_element = Array.from(document.getElementsByClassName('skin_element'));

skin_element.forEach(element => {
    element.addEventListener('click', (event) => {

        if (event.currentTarget.classList.contains('selected_element')) {
            event.currentTarget.classList.remove('selected_element');


        }else {
            Array.from(event.currentTarget.parentNode.children).forEach(element => {
                element.classList.remove('selected_element')
                
            });

            event.currentTarget.classList.add('selected_element');
        }

        draw_base_skin(original_skin_ctx);
        draw_finished_skin(edited_skin_ctx);
        draw_finished_skin(edited_skin_preview_ctx);
    });
});


const choose_alex = document.getElementById('choose_alex_arm_size');
const choose_steve = document.getElementById('choose_steve_arm_size');
const alex_size_elements = Array.from(document.getElementsByClassName('alex_arm_size'));
const steve_size_elements = Array.from(document.getElementsByClassName('steve_arm_size'));

choose_alex.addEventListener('click', () => {

    alex_size_elements.forEach(element => {
        element.classList.remove('hidden');
        
    });
    
    steve_size_elements.forEach(element => {
        element.classList.add('hidden');
        element.classList.remove('selected_element');

    });

    draw_base_skin(original_skin_ctx);
    draw_finished_skin(edited_skin_ctx);
    draw_finished_skin(edited_skin_preview_ctx);
});

choose_steve.addEventListener('click', () => {

    alex_size_elements.forEach(element => {
        element.classList.add('hidden');
        element.classList.remove('selected_element');

    });

    steve_size_elements.forEach(element => {
        element.classList.remove('hidden');

    });

    draw_base_skin(original_skin_ctx);
    draw_finished_skin(edited_skin_ctx);
    draw_finished_skin(edited_skin_preview_ctx);
});

choose_alex.click();


// const section_title = Array.from(document.getElementsByClassName('element_section_title'));

// section_title.forEach(element => {
//     element.addEventListener('click', (event) => {
//         event.currentTarget.parentNode.classList.add('hidden');
        
//     });
// });


const download_btn = document.getElementById('download_skin');

download_btn.addEventListener('click', () => {
    let link = document.createElement('a');
    link.download = 'your_viking_skin.png';
    link.href = edited_skin.toDataURL();
    link.click();
})