import React from 'react';
import Cta from './Cta';
import ImageBox from './Imgbox';
export default function Card(props) {
    // console.log(props);
    const {className, header, body, footer} = props; 
    return (
        
        <div className={
            [
                'card-box',
                (className) ? className : ''
            ].join(" ")
        }>
            {
                header && 
                <div className="card-header">
                    {
                        header.imgBox && 
                        <ImageBox data={header.imgBox}/>
                    }
                    {
                        header.cta && 
                        <Cta data={header.cta}/>
                    }
                    {
                        header.html && 
                        <div dangerouslySetInnerHTML={{__html: header.html}} />
                    }
                </div>
            }
            {
                body && 
                <div className="card-body">
                    {
                        body.imgBox && 
                        <ImageBox data={body.imgBox}/>
                    }
                    {
                        body.cta && 
                        <Cta data={body.cta}/>
                    }
                    {
                        body.html && 
                        <div dangerouslySetInnerHTML={{__html: body.html}} />
                    }
                </div>
            }
            {
                footer && 
                <div className="card-footer">
                    {
                        footer.imgBox && 
                        <ImageBox data={footer.imgBox}/>
                    }
                    {
                        footer.cta && 
                        <Cta data={footer.cta}/>
                    }
                    {
                        footer.html && 
                        <div dangerouslySetInnerHTML={{__html: footer.html}} />
                    }
                </div>
            }
            
        </div>
    )
}
