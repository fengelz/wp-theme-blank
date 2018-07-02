import React from 'react'
import Html from '../../atoms/Html'
import Head from '../../atoms/Head'
import Body from '../../atoms/Body'

function MastePage(props) {
  return (
    <Html>
        <Head title={props.title} />
        <Body className={props.className || ''}>
          { props.children }
        </Body>
    </Html>
  )
}

export default MastePage