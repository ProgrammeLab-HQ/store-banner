import React from 'react';
import { Image } from 'react-bootstrap';
export default function Imgbox(props) {
    // console.log(props)
    const {className, img, title, content, btn} = props.data;
    return (
        <div  className={
            [
                'img-box',
                'd-flex',
                (className) ? className : ''
            ].join(" ")
        }>
            {img &&
                <div className="part-img">                            
                    <Image className="img-box-image" fluid="fluid" src={img} />
                </div>
            }
            <div className="part-content">
                {title && 
                    <h3 className="img-box-title" dangerouslySetInnerHTML={{__html: title}} />
                }
                {content && 
                    <div className="img-box-content" dangerouslySetInnerHTML={{__html: content}} />
                }
                {
                    btn && btn.length && 
                    <div className="img-box-button-group mt-2">
                        {btn.map((item, index) => (
                            <a 
                            className={
                                [
                                    'img-box-button',
                                    (item.className) ? item.className : ''
                                ].join(" ")
                            }
                            key={index} 
                            href={item.url} 
                            target="_blank">{item.title}</a>
                        ))} 
                    </div>
                }
            </div>
        </div>
    )
}
