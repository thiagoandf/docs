import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";

import DocumentationSidebar from '../../components/Sidebar';
import CodeBlock from '../../components/CodeBlock';
import {
  getFile,
  getFileStructure,
  organizeFilesStructure,
} from '../../components/gitFetching.js';

import './index.css';

export default function DocumentationRoot() {
  const location = useLocation();
  const history = useHistory();

  const [md, setMd] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [pgs, setPgs] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState({ path: '' });

  useEffect(() => {
    const search = location.search.replace(/[^0-9]/gi, '');
    setLoading(true);
    getFileStructure()
      .then(r => {
        const fileStructure = organizeFilesStructure(r);
        setPgs(fileStructure);
        setLoading(false);
        if (search.length > 0) {
          setCurrentPage(
            fileStructure[
              Object.keys(fileStructure)[parseInt(search.slice(0, 2), 10) - 1]
            ].children[parseInt(search.slice(-1), 10) - 1],
          );
        } else
          setCurrentPage(
            fileStructure[Object.keys(fileStructure)[0]].children[0],
          );
      })
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    const path = currentPage.path.replace(/[^0-9]/gi, '');
    history.push(`/documentation?file=${path}`);
    if (currentPage.path && !sessionStorage.getItem(path)) {
      setLoading(true);
      getFile(currentPage.path).then(resp => {
        setLoading(false);
        sessionStorage.setItem(path, JSON.stringify(resp));
        setMd(resp);
      });
    } else if (sessionStorage.getItem(path)) {
      setMd(JSON.parse(sessionStorage.getItem(path)));
    }
  }, [currentPage]);

  const code = ({ inline, className, children, ...props}) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeBlock
        language={match[1]}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="documentation">
      <div className="desk-only">
        <DocumentationSidebar
          pages={pgs}
          switchPage={e => setCurrentPage(e)}
          selected={currentPage}
        />
      </div>
      <div className="codeContainer">
        {loading ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            Loading....
          </div>
        ) : (
          <ReactMarkdown
            components={{ code }}
            linkTarget={url => {
              if (url.includes('http') || url.includes('@')) {
                return '_blank';
              }
              return undefined;
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {md}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
