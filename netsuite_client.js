define('N/nsobject',[],function(){function NetSuiteObject(){}
Object.freeze(NetSuiteObject);return{getNewInstance:function(){return new NetSuiteObject();},isInstanceOfNSObject:function(obj){return obj instanceof NetSuiteObject;}};});define('N/restricted/reflet',[],function()
{var chargeMap={};var currentScriptInfo={};var usageCostMap=null;var totalBundleUsage={};var nsJSONProxyURL='/app/common/scripting/nlapijsonhandler.nl';var warningMessages=[];function alert(msg){warningMessages.push(msg);}
function checkWarningMessageInSession(){var count=warningMessages.length;if(count>0){var lastMsg=warningMessages.pop();var warningMsg=lastMsg;if(count>1){warningMsg="Multiple Error Detected"+"\n"+lastMsg+"\n";for(var msgIndex in warningMessages){var msg=warningMessages[msgIndex];warningMsg=warningMsg+msg+"\n";}}
var error=new Error(warningMsg);error.name="USER_ERROR";throw error;}}
function getCharges()
{return chargeMap[currentScriptInfo.scriptId]||0;}
function setupScript(thisObject)
{currentScriptInfo={scriptId:thisObject.scriptId,deployId:thisObject.deployId,bundleId:thisObject.bundleId};chargeMap[thisObject.scriptId]=0;}
function recoverScript(thisObject)
{currentScriptInfo={scriptId:thisObject.scriptId,deployId:thisObject.deployId,bundleId:thisObject.bundleId};}
function getScript()
{return currentScriptInfo;}
function chargeUsage(method,type,args,governanceOverride){}
function createError(myCode,myDetails,suppressNotification)
{var error=Error(myDetails);error.name=myCode;try
{throw error;}
catch(e)
{error=e;}
return{getId:function(){return null},getCode:function(){return error.name},getDetails:function(){return error.message},getStackTrace:function(){return error.stack.split("\n");}};}
function getTotalUsage()
{var bundle=-1;var script=currentScriptInfo.scriptId;if(script!=null&&script!="global"&&script!="internal")
{bundle=currentScriptInfo.bundleId;if(bundle==null||bundle=='')bundle=-1;}
if(totalBundleUsage[bundle]==null)
{totalBundleUsage[bundle]=serverCallSync(nsJSONProxyURL,"getTotalScriptGovernance",[bundle]);}
return totalBundleUsage[bundle];}
function getErrorMsg(errorCode,errorVal1,errorVal2,errorVal3,errorVal4)
{return serverCallSync(nsJSONProxyURL,"getErrorMessage",[errorCode,errorVal1,errorVal2,errorVal3,errorVal4]);}
function calculateRemainingUsage()
{return getTotalUsage()-parseInt(getCharges(),10);}
var theContext=null;function getContext()
{try
{if(theContext===null)
{if(typeof nsDefaultContextObj!=='undefined'&&nsDefaultContextObj!==null)
theContext=nsDefaultContextObj;else
{theContext=serverCallSync(nsJSONProxyURL,"getContext");theContext.internal=true;theContext.contexttypes=JSON.parse(theContext.contexttypes);}}}
catch(e)
{throw Error(e);}
function getRecordType()
{if(theContext.recordType==null)
{require.forceSync(true);try{require(['N/currentRecord'],function(crMod){theContext.recordType=crMod.get().type;});}
finally{require.forceSync(false);}}
return theContext.recordType;}
function getPref(name)
{if(name.toLowerCase().indexOf('custscript')==0)
{if(theContext.scriptprefs==null)
{theContext.scriptprefs=serverCallSync(nsJSONProxyURL,"getScriptPrefs",[getRecordType()]);}
return theContext.scriptprefs[name];}
name=name.toUpperCase();if(typeof preferencesCache==="undefined"||!preferencesCache||typeof preferencesCache[name]==="undefined")
{serverCallAsync(nsJSONProxyURL,"getPreferences",[],function(data){if(data!=null||data)
{preferencesCache=data.result==null?data:data.result;}});return serverCallSync(nsJSONProxyURL,"getPref",[name]);}
var prefValue=preferencesCache[name];var prefType=getPrefType(name);if(('T'===prefValue||'F'===prefValue)&&('boolean'===prefType))
return 'T'===prefValue;else
return prefValue;}
function getPrefType(name)
{if(name.toLowerCase().indexOf('custscript')==0)
{if(theContext.scriptpreftypes==null)
{theContext.scriptpreftypes=serverCallSync(nsJSONProxyURL,"getScriptPrefTypes",[getRecordType()]);}
return theContext.scriptpreftypes[name];}
name=name.toUpperCase();if(typeof preferencesTypesCache==="undefined"||!preferencesTypesCache||typeof preferencesTypesCache[name]==="undefined")
{serverCallAsync(nsJSONProxyURL,"getAllPreferencesTypes",[],function(data){if(data!=null||data)
{preferencesTypesCache=data.result==null?data:data.result;}});return serverCallSync(nsJSONProxyURL,"getPrefType",[name]);}
return preferencesTypesCache[name];}
return{getLogLevel:function(){return undefined;},getScriptId:function(){return!!currentScriptInfo?currentScriptInfo.scriptId:undefined},getPercentComplete:function(){return undefined;},setPercentComplete:function(){return undefined;},getDeploymentId:function(){return!!currentScriptInfo?currentScriptInfo.deployId:undefined},getBundleId:function(){return!!currentScriptInfo?currentScriptInfo.bundleId:undefined},getBundleIds:function()
{var rc=!!currentScriptInfo&&currentScriptInfo.hasOwnProperty('bundleId')?currentScriptInfo.bundleId.split(','):undefined;if(Array.isArray(rc)&&rc.length===1&&rc[0]==='')
return[];return rc;},getRemainingUsage:function(){return calculateRemainingUsage();},getPreferenceObject:function(name){return getPref(name);},getPreference:function(name){return getPref(name);},getPreferenceType:function(name){return getPrefType(name);},getSessionObject:function(name){return serverCallSync(nsJSONProxyURL,"getSessionObject",[name]);},setSessionObject:function(){return undefined;},getEmail:function(){return theContext.email;},getName:function(){return theContext.name;},getLocation:function(){return parseInt(theContext.location,10);},getDepartment:function(){return parseInt(theContext.department,10);},getRole:function(){return parseInt(theContext.role,10);},getRoleCenter:function(){return theContext.rolecenter;},getRoleId:function(){return theContext.roleid;},getUser:function(){return parseInt(theContext.user,10);},getSubsidiary:function(){return parseInt(theContext.subsidiary,10);},getPermission:function(name)
{name=name.toUpperCase();if(typeof permissionsCache==="undefined"||!permissionsCache||typeof permissionsCache[name]==="undefined")
{serverCallAsync(nsJSONProxyURL,"getPermissions",[],function(data){if(data!=null||data)
{permissionsCache=data.result==null?data:data.result;}});return serverCallSync(nsJSONProxyURL,"getPerm",[name]);}
return permissionsCache[name];},getFeature:function(name)
{name=name.toUpperCase();if(typeof featuresCache==="undefined"||!featuresCache||typeof featuresCache.set==="undefined")
{serverCallAsync(nsJSONProxyURL,"getFeatures",[],function(data){if(data!=null||data)
{featuresCache=data.result==null?data:data.result;}});return serverCallSync(nsJSONProxyURL,"getFeature",[name]);}
return featuresCache.set==null?featuresCache.hasOwnProperty(name):featuresCache.set.hasOwnProperty(name);},getQueueCount:function(){return undefined;},getProcessorCount:function(){return undefined;},getVersion:function(){return theContext.version;},getCompany:function(){return theContext.company;},getEnvironment:function(){return theContext.environment;},getExecutionContext:function(){return theContext.context;},getExecutionContextTypes:function(){return theContext.contexttypes;},isInternal:function(){return theContext.internal;},getScriptType:function(){return "CLIENT";}}}
function XMLtoString(xml)
{if(!xml)
{var error=new Error(getErrorMsg("SSS_MISSING_REQD_ARGUMENT"));error.name="SSS_MISSING_REQD_ARGUMENT";throw error;}
try
{if(xml.nodeType===2)
return xml.name+'='+xml.value;else if(window.XMLSerializer&&window.XPathEvaluator)
return new XMLSerializer().serializeToString(xml);else
return xml.xml}
catch(e)
{throw e;}}
function wrap(node)
{if(!node)
{return node}
switch(node.nodeType)
{case 1:return wrapElement(node);case 2:return wrapAttr(node);case 9:return wrapDocument(node);default:return wrapNode(node);}}
function wrapAttr(attr)
{var wrappedAttr={};wrappedAttr.getName=function(){return attr.name;};wrappedAttr.getOwnerElement=function(){return wrap(attr.ownerElement);};wrappedAttr.getSpecified=function(){return attr.specified;};wrappedAttr.getValue=function(){return attr.value;};wrappedAttr.setValue=function(val){attr.value=val;};return wrappedAttr;}
function wrapDocument(doc)
{var wrappedDoc=wrapNode(doc);wrappedDoc.hasAttributes=undefined;wrappedDoc.adoptNode=function(source){return wrap(doc.adoptNode(source))};wrappedDoc.createAttribute=function(name){return wrapAttr(doc.createAttribute(name))};wrappedDoc.createAttributeNS=function(qualifiedName){return wrapAttr(doc.createAttributeNS(qualifiedName))};wrappedDoc.createCDATASection=function(data){return wrapNode(doc.createCDATASection(data))};wrappedDoc.createComment=function(data){return wrapNode(doc.createComment(data))};wrappedDoc.createDocumentFragment=function(){return wrapNode(doc.createDocumentFragment())};wrappedDoc.createElement=function(tagName){return wrapElement(doc.createElement(tagName))};wrappedDoc.createElementNS=function(namespaceURI,qualifiedName){return wrapElement(doc.createElementNS(namespaceURI,qualifiedName))};wrappedDoc.createProcessingInstruction=function(target,data){return wrapNode(doc.createProcessingInstruction(target,data))};wrappedDoc.createTextNode=function(data){return wrapNode(doc.createTextNode(data))};wrappedDoc.getElementById=function(elementId){return wrapElement(doc.getElementById(elementId))};wrappedDoc.getElementsByTagName=function(tagName){return wrapElement(doc.getElementsByTagName(tagName))};wrappedDoc.getElementsByTagNameNS=function(namespaceURI,localName){return wrapElement(doc.getElementsByTagNameNS(namespaceURI,localName))};wrappedDoc.importNode=function(importedNode,deep){return wrap(doc.importNode(importedNode,deep))};wrappedDoc.normalizeDocument=function(){return doc.normalize();};wrappedDoc.getDoctype=function(){return wrapNode(doc.doctype)};wrappedDoc.getDocumentElement=function(){return wrapElement(doc.documentElement)};wrappedDoc.getDocumentURI=function(){return doc.documentURI};wrappedDoc.setDocumentURI=function(val){doc.documentURI=val};wrappedDoc.getInputEncoding=function(){return doc.inputEncoding};wrappedDoc.getXmlEncoding=function(){return doc.xmlEncoding};wrappedDoc.getXmlStandalone=function(){return doc.xmlStandalone};wrappedDoc.setXmlStandalone=function(val){doc.xmlStandalone=val};wrappedDoc.getXmlVersion=function(){return doc.xmlVersion};wrappedDoc.setXmlVersion=function(val){doc.xmlVersion=val};return wrappedDoc;}
function wrapElement(element)
{var wrappedElem=wrapNode(element)
wrappedElem.getAttribute=function(name){return element.getAttribute(name);};wrappedElem.getAttributeNode=function(name){return wrap(element.getAttributeNode(name));};wrappedElem.getAttributeNodeNS=function(namespaceURI,localName){return wrap(element.getAttributeNodeNS(namespaceURI,localName));};wrappedElem.getAttributeNS=function(namespaceURI,localName){return element.getAttributeNS(namespaceURI,localName);};wrappedElem.getElementsByTagName=function(tagName){return wrapElement(element.getElementsByTagName(tagName));};wrappedElem.getElementsByTagNameNS=function(namespaceURI,localName){return wrapElement(element.getElementsByTagNameNS(namespaceURI,localName));};wrappedElem.hasAttribute=function(name){return element.hasAttribute(name);};wrappedElem.hasAttributeNS=function(namespaceURI,localName){return element.hasAttributeNS(namespaceURI,localName);};wrappedElem.removeAttribute=function(name){return element.removeAttribute(name);};wrappedElem.removeAttributeNode=function(oldAttr){return wrap(element.removeAttributeNode(oldAttr));};wrappedElem.removeAttributeNS=function(namespaceURI,localName){return element.removeAttributeNS(namespaceURI,localName);};wrappedElem.setAttribute=function(name,value){return element.setAttribute(name,value);};wrappedElem.setAttributeNode=function(newAttr){return element.setAttributeNode(newAttr);};wrappedElem.setAttributeNodeNS=function(newAttr){return element.setAttributeNodeNS(newAttr);};wrappedElem.setAttributeNS=function(namespaceURI,qualifiedName,value){return element.setAttributeNS(namespaceURI,qualifiedName,value);};wrappedElem.getTagName=function(){return element.getTagName();};return wrappedElem;}
function wrapNode(node)
{return{appendChild:function(newChild){return wrap(node.appendChild(newChild));},cloneNode:function(deep){return wrap(node.cloneNode(deep));},compareDocumentPosition:function(other){return node.compareDocumentPosition(other);},hasAttributes:function(){return node.hasAttributes();},hasChildNodes:function(){return node.hasChildNodes();},insertBefore:function(newChild,refChild){return wrap(node.insertBefore(newChild,refChild));},isDefaultNamespace:function(namespaceURI){return node.isDefaultNamespace(namespaceURI);},isEqualNode:function(other){return node.isEqualNode(other);},isSameNode:function(other){return node.isSameNode(other);},lookupNamespaceURI:function(prefix){return node.lookupNamespaceURI(prefix);},lookupPrefix:function(namespaceURI){return node.lookupPrefix(namespaceURI);},normalize:function(){return node.normalize();},removeChild:function(oldChild){return wrap(node.removeChild(oldChild));},replaceChild:function(newChild,oldChild){return wrap(node.replaceChild(newChild,oldChild));},getAttributes:function(){return node.attributes;},getBaseURI:function(){return null;},getFirstChild:function(){return wrap(node.firstChild);},getLastChild:function(){return wrap(node.lastChild);},getLocalName:function(){return node.localName;},getNamespaceURI:function(){return node.namespaceURI;},getNextSibling:function(){return wrap(node.nextSibling);},getNodeName:function(){return node.nodeName;},getNodeType:function(){return node.nodeType;},getNodeValue:function(){return node.nodeValue;},setNodeValue:function(val){return node.nodeValue=val;},getOwnerDocument:function(){return wrap(node.ownerDocument);},getParentNode:function(){return wrap(node.parentNode);},getPrefix:function(){return node.prefix;},setPrefix:function(val){return node.prefix=val;},getPreviousSibling:function(){return wrap(node.previousSibling);},getTextContent:function(){return node.textContent;},setTextContent:function(val){return node.textContent=val;},_gd:function(){return node;}}}
function createIEDoc()
{var doc=null;if(document.implementation&&document.implementation.createDocument&&!(window.ActiveXObject!==undefined))
doc=document.implementation.createDocument("","",null);else
{try
{doc=new ActiveXObject("Msxml2.DOMDocument.6.0");}
catch(e)
{try
{doc=new ActiveXObject("Msxml2.DOMDocument.3.0");}
catch(e)
{doc=new ActiveXObject("Msxml2.DOMDocument.4.0");}}
if(doc!=null)
{doc.async=false;doc.resolveExternals=false;}}
return doc;}
function stringToXML(text,dontThrow)
{var nsDocument=null;if(window.DOMParser&&window.XPathEvaluator)
{nsDocument=new DOMParser().parseFromString(text,'text/xml')
if(!dontThrow)
{var parserErrors=nsDocument.getElementsByTagName("parsererror")
if(parserErrors.length>0)
{var error=new Error(getErrorMsg("SSS_XML_DOM_EXCEPTION")+' '+parserErrors[0].innerHTML);error.name="SSS_XML_DOM_EXCEPTION";throw error;}}}
else if(!window.XPathEvaluator)
{nsDocument=createIEDoc();nsDocument.loadXML(text);if(!dontThrow)
{if(nsDocument.parseError&&nsDocument.parseError.errorCode!==0)
{var error=new Error(getErrorMsg("SSS_XML_DOM_EXCEPTION")+' '+nsDocument.parseError.reason);error.name="SSS_XML_DOM_EXCEPTION";throw error;}}}
else
{return null;}
return nsDocument;}
function selectNodes(node,expr)
{if(!node||!node.hasChildNodes())
return[];var nodes=null;var owner=node.ownerDocument!=null?node.ownerDocument:node;if(window.XPathEvaluator)
{var xpe=new XPathEvaluator();var resolver=function(prefix)
{return thisNameSpace[prefix];}
var thisNameSpace={};if(XMLtoString(node).indexOf('xmlns')!=-1)
{var nodelist=owner.getElementsByTagName("*")
for(var j=0;j<nodelist.length;j++)
{var attributes=nodelist[j].attributes;for(var i=0;attributes!=null&&i<attributes.length;i++)
{if(attributes[i].name=='xmlns')
thisNameSpace["nlapi"]=attributes[i].nodeValue;else if(attributes[i].name.indexOf('xmlns:')==0)
thisNameSpace[attributes[i].name.substring(6)]=attributes[i].nodeValue;}}}
var results=xpe.evaluate(expr,node,resolver,XPathResult.ANY_TYPE,null)
if(results!=null)
{nodes=new Array();var result;while(result=results.iterateNext())
nodes[nodes.length]=result;}}
else
{if(XMLtoString(node).indexOf('xmlns')!=-1)
{var namespaces=null;owner.setProperty("SelectionLanguage","XPath");var nodelist=owner.getElementsByTagName("*")
for(var j=0;j<nodelist.length;j++)
{var attributes=nodelist[j].attributes;for(var i=0;attributes!=null&&i<attributes.length;i++)
{if(attributes[i].name.indexOf('xmlns:')==0)
namespaces=(namespaces!=null?namespaces+" ":"")+attributes[i].xml;else if(attributes[i].name=='xmlns')
namespaces=(namespaces!=null?namespaces+" ":"")+"xmlns:nlapi=\""+attributes[i].nodeValue+"\"";}}
if(namespaces!=null)
owner.setProperty("SelectionNamespaces",namespaces)}
nodes=node.selectNodes(expr);}
return nodes;}
function throwNotSupported()
{var e=new Error(getErrorMsg("SSS_NOT_YET_SUPPORTED"))
e.name="SSS_NOT_YET_SUPPORTED";throw e;}
return Object.freeze({nlapiCreateError:createError,getErrorMessage:getErrorMsg,transform:function(record){return record},nlapiGetContext:function(){return getContext();},nlapiXMLToString:function(xml){return XMLtoString(xml);},nlapiStringToXML:function(text,dontThrow){return stringToXML(text,dontThrow);},nlapiSelectNodes:selectNodes,nlapiValidateXML:function(){throwNotSupported();},nsObjectToMap:function(obj){return obj;},setupScript:setupScript,recoverScript:recoverScript,getScript:getScript,chargeUsage:chargeUsage,alert:alert,checkWarningMessageInSession:checkWarningMessageInSession});});define('N/restricted/xmlApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/restricted/errorApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/restricted/remoteApiBridge',['N/restricted/reflet'],function(reflet){return reflet;});define('N/error',['N/restricted/xmlApi','N/restricted/errorApi','N/restricted/remoteApiBridge','N/nsobject'],function(xmlApi,errorApi,remoteUtil,nsobject)
{var ERROR_TYPES=Object.freeze({MISSING_REQD_ARGUMENT:'SSS_MISSING_REQD_ARGUMENT',READ_ONLY_PROPERTY:'READ_ONLY_PROPERTY',WRONG_PARAMETER_TYPE:'WRONG_PARAMETER_TYPE',UNKNOWN_PARAM:'UNKNOWN_PARAM',INVALID_FLD_VALUE:'INVALID_FLD_VALUE',INVALID_FIELD_VALUE:'INVALID_FIELD_VALUE',VALUE_1_OUTSIDE_OF_VALID_MINMAX_RANGE_FOR_FIELD_2:'VALUE_1_OUTSIDE_OF_VALID_MINMAX_RANGE_FOR_FIELD_2',INVALID_NUMBER_MUST_BE_BETWEEN_1_AND_2:'INVALID_NUMBER_MUST_BE_BETWEEN_1_AND_2',INVALID_KEY_OR_REF:'WS_INVALID_REFERENCE_KEY_1',EMPTY_KEY_NOT_ALLOWED:'EMPTY_KEY_NOT_ALLOWED',INVALID_URL_URL_MUST_START_WITH_HTTP_HTTPS_FTP_OR_FILE:'INVALID_URL_URL_MUST_START_WITH_HTTP_HTTPS_FTP_OR_FILE',INVALID_URL_SPACES_ARE_NOT_ALLOWED_IN_THE_URL:'INVALID_URL_SPACES_ARE_NOT_ALLOWED_IN_THE_URL',INVALID_NUMBER_OR_PERCENTAGE:'INVALID_NUMBER_OR_PERCENTAGE',INVALID_EMAILS_FOUND:'INVALID_EMAILS_FOUND',INVALID_RCRD_TYPE:'INVALID_RCRD_TYPE',IDENTIFIERS_CAN_CONTAIN_ONLY_DIGITS_ALPHABETIC_CHARACTERS_OR__WITH_NO_SPACES:'IDENTIFIERS_CAN_CONTAIN_ONLY_DIGITS_ALPHABETIC_CHARACTERS_OR__WITH_NO_SPACES',CREDIT_CARD_NUMBERS_MUST_CONTAIN_BETWEEN_13_AND_20_DIGITS:'CREDIT_CARD_NUMBERS_MUST_CONTAIN_BETWEEN_13_AND_20_DIGITS',CREDIT_CARD_NUMBER_MUST_CONTAIN_ONLY_DIGITS:'CREDIT_CARD_NUMBER_MUST_CONTAIN_ONLY_DIGITS',CREDIT_CARD_NUMBER_IS_NOT_VALID__PLEASE_CHECK_THAT_ALL_DIGITS_WERE_ENTERED_CORRECTLY:'CREDIT_CARD_NUMBER_IS_NOT_VALID__PLEASE_CHECK_THAT_ALL_DIGITS_WERE_ENTERED_CORRECTLY',PHONE_NUMBER_SHOULD_HAVE_SEVEN_DIGITS_OR_MORE:'PHONE_NUMBER_SHOULD_HAVE_SEVEN_DIGITS_OR_MORE',PLEASE_INCLUDE_THE_AREA_CODE_FOR_PHONE_NUMBER:'PLEASE_INCLUDE_THE_AREA_CODE_FOR_PHONE_NUMBER',THE_FIELD_1_CONTAINED_MORE_THAN_THE_MAXIMUM_NUMBER__2__OF_CHARACTERS_ALLOWED:'THE_FIELD_1_CONTAINED_MORE_THAN_THE_MAXIMUM_NUMBER__2__OF_CHARACTERS_ALLOWED',PROPERTY_VALUE_CONFLICT:'PROPERTY_VALUE_CONFLICT',FORM_VALIDATION_FAILED_YOU_CANNOT_CREATE_THIS_SUBRECORD:'FORM_VALIDATION_FAILED_YOU_CANNOT_CREATE_THIS_SUBRECORD',FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD:'FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD',PLEASE_ENTER_AN_EXPIRATION_DATE_IN_MMYYYY_FORMAT:'PLEASE_ENTER_AN_EXPIRATION_DATE_IN_MMYYYY_FORMAT',PLEASE_ENTER_A_VALID_FROM_START_DATE_IN_MMYYYY_FORMAT:'PLEASE_ENTER_A_VALID_FROM_START_DATE_IN_MMYYYY_FORMAT',NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT:'NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT',FIELD_MUST_CONTAIN_A_VALUE:'FIELD_MUST_CONTAIN_A_VALUE',NON_KATAKANA_DATA_FOUND:'NON_KATAKANA_DATA_FOUND',COLOR_VALUE_MUST_BE_6_HEXADECIMAL_DIGITS_OF_THE_FORM_RRGGBB__EXAMPLE_FF0000_FOR_RED:'COLOR_VALUE_MUST_BE_6_HEXADECIMAL_DIGITS_OF_THE_FORM_RRGGBB__EXAMPLE_FF0000_FOR_RED',INVALID_DATE_VALUE_MUST_BE_1:'INVALID_DATE_VALUE_MUST_BE_1',INVALID_DATE_VALUE_MUST_BE_ON_OR_AFTER_1CUTOFF_DATE:'INVALID_DATE_VALUE_MUST_BE_ON_OR_AFTER_1CUTOFF_DATE',INVALID_GETSELECTOPTION_FILTER_OPERATOR:'SSS_INVALID_GETSELECTOPTION_FILTER_OPERATOR',INVALID_UI_OBJECT_TYPE:'SSS_INVALID_UI_OBJECT_TYPE',INVALID_SUBLIST_OPERATION:'SSS_INVALID_SUBLIST_OPERATION',INVALID_SUITEAPP_APPLICATION_ID:'INVALID_SUITEAPP_APPLICATION_ID',INVALID_SCRIPT_OPERATION_ON_READONLY_SUBLIST_FIELD:'A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD',WS_NO_PERMISSIONS_TO_SET_VALUE:'WS_NO_PERMISSIONS_TO_SET_VALUE',SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED:'SCRIPT_EXECUTION_USAGE_LIMIT_EXCEEDED',NOT_SUPPORTED_ON_CURRENT_SUBRECORD:'NOT_SUPPORTED_ON_CURRENT_SUBRECORD',FIELD_1_IS_NOT_A_SUBRECORD_FIELD:'FIELD_1_IS_NOT_A_SUBRECORD_FIELD',THAT_RECORD_IS_NOT_EDITABLE:'THAT_RECORD_IS_NOT_EDITABLE',SSS_INVALID_TYPE_ARG:'SSS_INVALID_TYPE_ARG',SSS_INVALID_SRCH_OPERATOR:'SSS_INVALID_SRCH_OPERATOR',SSS_INVALID_URL:'SSS_INVALID_URL',SSS_INVALID_CURRENCY_ID:'SSS_INVALID_CURRENCY_ID',SSS_INVALID_API_USAGE:'SSS_INVALID_API_USAGE',FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD:'FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD',BUTTONS_MUST_INCLUDE_BOTH_A_LABEL_AND_VALUE:'BUTTONS_MUST_INCLUDE_BOTH_A_LABEL_AND_VALUE',SSS_INVALID_UI_OBJECT_TYPE:'SSS_INVALID_UI_OBJECT_TYPE',INVALID_PAGE_RANGE:'INVALID_PAGE_RANGE',SSS_UNSUPPORTED_METHOD:'SSS_UNSUPPORTED_METHOD',SSS_TAX_REGISTRATION_REQUIRED:'SSS_TAX_REGISTRATION_REQUIRED',INVALID_DIRECTION_FOR_SORTING:'INVALID_DIRECTION_FOR_SORTING',INVALID_COLUMN_FOR_SORTING:'INVALID_COLUMN_FOR_SORTING',INVALID_FILTER_FIELD_FOR_CURRENT_VIEW:'INVALID_FILTER_FIELD_FOR_CURRENT_VIEW',INVALID_CUSTOM_VIEW_VALUE:'INVALID_CUSTOM_VIEW_VALUE',INVALID_PAGE_INDEX:'INVALID_PAGE_INDEX',INVALID_TASK_TYPE:'INVALID_TASK_TYPE',METHOD_IS_ONLY_ALLOWED_FOR_MATRIX_FIELD:'SSS_METHOD_IS_ONLY_ALLOWED_FOR_MATRIX_FIELD',SSS_METHOD_IS_ONLY_ALLOWED_FOR_MULTISELECT_FIELD:'SSS_METHOD_IS_ONLY_ALLOWED_FOR_MULTISELECT_FIELD',SSS_METHOD_IS_ONLY_ALLOWED_FOR_SELECT_FIELD:'SSS_METHOD_IS_ONLY_ALLOWED_FOR_SELECT_FIELD',SSS_RECORD_TYPE_MISMATCH:'SSS_RECORD_TYPE_MISMATCH',SSS_INVALID_SUBLIST_OPERATION:'SSS_INVALID_SUBLIST_OPERATION',SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED:'SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED',SSS_INVALID_SEARCH_RESULT_INDEX:'SSS_INVALID_SEARCH_RESULT_INDEX',SSS_SEARCH_RESULT_LIMIT_EXCEEDED:'SSS_SEARCH_RESULT_LIMIT_EXCEEDED',INVALID_FIELD_INDEX:'INVALID_FIELD_INDEX',INVALID_FIELD_ID:'INVALID_FIELD_ID',INVALID_SUBRECORD_REFEFAILED_AN_UNEXPECTED_ERROR_OCCURREDRENCE:'INVALID_SUBRECORD_REFERENCE',FAILED_AN_UNEXPECTED_ERROR_OCCURRED:'FAILED_AN_UNEXPECTED_ERROR_OCCURRED',CANNOT_CREATE_RECORD_INSTANCE:'CANNOT_CREATE_RECORD_INSTANCE',INVALID_SUBRECORD_MERGE:'INVALID_SUBRECORD_MERGE',OPERATION_IS_NOT_ALLOWED:'OPERATION_IS_NOT_ALLOWED',INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_FOR_1:'INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_FOR_1',INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_WITHOUT_A_CONTEXT:'INVALID_CONFIGURATION_UNABLE_TO_CHANGE_REQUIRE_CONFIGURATION_WITHOUT_A_CONTEXT',MUTUALLY_EXCLUSIVE_ARGUMENTS:'MUTUALLY_EXCLUSIVE_ARGUMENTS',RELATIONSHIP_ALREADY_USED:'RELATIONSHIP_ALREADY_USED',INVALID_SEARCH_TYPE:'INVALID_SEARCH_TYPE',OPERATOR_ARITY_MISMATCH:'OPERATOR_ARITY_MISMATCH',INVALID_SEARCH_OPERATOR:'INVALID_SEARCH_OPERATOR',NEITHER_ARGUMENT_DEFINED:'NEITHER_ARGUMENT_DEFINED',SSS_INVALID_MACRO_ID:'SSS_INVALID_MACRO_ID',SSS_INVALID_ACTION_ID:'SSS_INVALID_ACTION_ID',SSS_RECORD_DOES_NOT_SATISFY_CONDITION:'SSS_RECORD_DOES_NOT_SATISFY_CONDITION',SELECT_OPTION_ALREADY_PRESENT:'SELECT_OPTION_ALREADY_PRESENT',SELECT_OPTION_NOT_FOUND:'SELECT_OPTION_NOT_FOUND',YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION:'YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION',INVALID_RETURN_TYPE_EXPECTED_1:'INVALID_RETURN_TYPE_EXPECTED_1',HISTORY_IS_ONLY_AVAILABLE_FOR_THE_LAST_30_DAYS:'HISTORY_IS_ONLY_AVAILABLE_FOR_THE_LAST_30_DAYS',SSS_ARGUMENT_DISCREPANCY:'SSS_ARGUMENT_DISCREPANCY',THE_OPTIONS_ARE_MUTUALLY_EXCLUSIVE_1_2_ARG2_:'THE_OPTIONS_ARE_MUTUALLY_EXCLUSIVE_1_2_ARG2_',INVALID_FORMULA_TYPE:'INVALID_FORMULA_TYPE',INVALID_AGGREGATE_TYPE:'INVALID_AGGREGATE_TYPE',INVALID_SORT_LOCALE:'INVALID_SORT_LOCALE',CANNOT_RESUBMIT_SUBMITTED_ASYNC_SEARCH_TASK:'CANNOT_RESUBMIT_SUBMITTED_ASYNC_SEARCH_TASK'});var isVersionTwoOne=xmlApi!==errorApi;function SuiteScriptError(delegate)
{var TYPE='error.SuiteScriptError';Object.defineProperty(this,'id',{get:function()
{return delegate.getId();},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'id'),false));},enumerable:true,configurable:false});Object.defineProperty(this,'name',{get:function()
{return delegate.name||(delegate.getCode)?delegate.getCode():'';},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'name'),false));},enumerable:true,configurable:false});Object.defineProperty(this,'message',{get:function()
{return delegate.message||(delegate.getDetails)?delegate.getDetails():'';},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'message'),false));},enumerable:true,configurable:false});Object.defineProperty(this,'stack',{get:function()
{return util.isFunction(delegate.getStackTrace)?delegate.getStackTrace().slice(0):'';},enumerable:true,configurable:false});Object.defineProperty(this,'cause',{get:function()
{return delegate.cause||this;},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'cause'),false));},enumerable:true,configurable:false});Object.defineProperty(this,'notifyOff',{get:function()
{return delegate.notifyOff;},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'notifyOff'),false));},enumerable:true,configurable:false});this.userFacing=true;this.toJSON=function toJSON()
{var delegateType=typeof(delegate);return{type:TYPE,name:this.name,message:this.message,stack:this.stack,cause:delegateType==="function"||delegateType==="object"&&!!delegate?delegate.cause||delegate:this,id:this.id,notifyOff:this.notifyOff,data:this.data,userFacing:this.userFacing};};this.toString=function toString()
{return JSON.stringify(this);};}
var debuggable=nsobject.getNewInstance();var err=Object.create(Error.prototype);debuggable.prototype=err;SuiteScriptError.prototype=debuggable;SuiteScriptError.prototype.constructor=SuiteScriptError;function UserEventError(delegate)
{var TYPE='error.UserEventError';Object.defineProperty(this,'recordId',{get:function()
{return delegate.getInternalId();},enumerable:true,configurable:false});Object.defineProperty(this,'eventType',{get:function()
{return delegate.getUserEvent();},enumerable:true,configurable:false});this.toJSON=function toJSON()
{var delegateType=typeof(delegate);return{type:TYPE,name:delegate.getCode(),message:delegate.getDetails(),stack:this.stack,eventType:delegate.getUserEvent(),recordId:delegate.getInternalId(),cause:delegateType==="function"||delegateType==="object"&&!!delegate?delegate.cause||delegate:this,id:this.id};};this.toString=function toString()
{return JSON.stringify(this);};}
UserEventError.prototype=new SuiteScriptError();function getErrorMessage(errorCode,errorVal1,errorVal2,errorVal3,errorVal4)
{return remoteUtil.getErrorMessage(errorCode,errorVal1,errorVal2,errorVal3,errorVal4);}
function prepareDelegate(apiError)
{var stackTrace=isVersionTwoOne?Error().stack.split("\n\t"):apiError.getStackTrace();var code=apiError.getCode();var details=apiError.getDetails();var id=apiError.getId();var userEvent=apiError.getUserEvent();var notifyOff=apiError.isSuppressNotification()||false;var delegate={getStackTrace:function(){return stackTrace;},getDetails:function(){return details;},getCode:function(){return code;},getId:function(){return id;}};delegate.notifyOff=notifyOff;delegate.cause={id:id,code:code,details:details,userEvent:userEvent,stackTrace:stackTrace.slice(0),toString:function(){return JSON.stringify(this);},toJSON:function()
{return{type:"internal error",code:code,details:details,userEvent:userEvent,stackTrace:stackTrace.slice(0),notifyOff:notifyOff};}};return delegate;}
function javaArrayToJsArray(javaArray)
{var toRet=[];for(var i=0;javaArray&&i<javaArray.length;i++)
toRet[i]=javaArray[i];return toRet;}
function getSafeCause(errorObj)
{var cause=errorObj.cause||errorObj;if(cause instanceof Error)
{var safeCopy={};Object.getOwnPropertyNames(cause).forEach(function(prop){safeCopy[prop]=(prop==="stack"||prop==="rhinoException")?cause[prop].toString():cause[prop];});cause=safeCopy;}
return cause;}
function addCustomDataToError(suiteScriptError,data)
{Object.defineProperty(suiteScriptError,'data',{get:function()
{return data;},set:function(val)
{throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.READ_ONLY_PROPERTY,getErrorMessage(ERROR_TYPES.READ_ONLY_PROPERTY,'data'),false));},enumerable:true,configurable:false});}
function createError(options)
{var currentStackTrace=null;if(isVersionTwoOne)
currentStackTrace=Error().stack.split("\n\t");if(!options)
throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.MISSING_REQD_ARGUMENT,getErrorMessage(ERROR_TYPES.MISSING_REQD_ARGUMENT,'error.create','options'),false));if(options.notifyOff!==undefined&&!util.isBoolean(options.notifyOff))
throw new SuiteScriptError(errorApi.nlapiCreateError(ERROR_TYPES.WRONG_PARAMETER_TYPE,getErrorMessage(ERROR_TYPES.WRONG_PARAMETER_TYPE,'options.notifyOff','boolean'),false));var toRet=null;if(options instanceof Object&&options.constructor.name==='JavaException')
{toRet=new SuiteScriptError(prepareDelegate(errorApi.nlapiCreateError(options,null,false)));if(!!options.javaException&&util.isFunction(options.javaException.getData))
addCustomDataToError(toRet,JSON.parse(options.javaException.getData()));toRet.userFacing=false;}
else if(!!options.getClass&&!!options.getClass().getName()&&(options.getClass().getName().endsWith('NLServerSideScriptException')||options.getClass().getName().endsWith('NLUserError')||options.getClass().getName().endsWith('SuiteScriptError')))
{toRet=new SuiteScriptError(prepareDelegate(errorApi.nlapiCreateError(options,null,false)));if(options.getClass().getName().endsWith('SuiteScriptError'))
addCustomDataToError(toRet,JSON.parse(options.getData()));}
else if(options instanceof Object&&options.constructor.name==='nlobjError')
{toRet=new SuiteScriptError(prepareDelegate(options));toRet.userFacing=false;}
else if(util.isError(options)||options instanceof SuiteScriptError)
{var apiError=errorApi.nlapiCreateError(options.name,options.message,options.notifyOff||false);var delegate={getStackTrace:function(){return isVersionTwoOne?currentStackTrace:apiError.getStackTrace();},getDetails:function(){return options.message;},getCode:function(){return options.name;},getId:function(){return options.id;}};delegate.cause=getSafeCause(options);delegate.notifyOff=options.notifyOff||false;toRet=new SuiteScriptError(delegate);}
else if(options.hasOwnProperty&&(options.hasOwnProperty('name')||options.hasOwnProperty('message')||options.hasOwnProperty('notifyOff')))
{var apiError=errorApi.nlapiCreateError(options.name,options.message,options.notifyOff||false);var delegate={getStackTrace:function(){return isVersionTwoOne?currentStackTrace:apiError.getStackTrace();},getDetails:function(){return apiError.getDetails();},getCode:function(){return apiError.getCode();},getId:function(){return apiError.getId();}};delegate.cause=getSafeCause(options);delegate.notifyOff=options.notifyOff||false;toRet=new SuiteScriptError(delegate);}
else if(typeof options!=='object')
{var apiError=errorApi.nlapiCreateError(options,null,false);var delegate={getStackTrace:function(){return isVersionTwoOne?currentStackTrace:apiError.getStackTrace();},getDetails:function(){return options;},getCode:function(){return "";},getId:function(){return apiError.getId();}};delegate.cause=getSafeCause(options);delegate.notifyOff=options.notifyOff||false;toRet=new SuiteScriptError(delegate);}
else
{var apiError=errorApi.nlapiCreateError(options,null,false);var delegate={getStackTrace:function(){return isVersionTwoOne?currentStackTrace:apiError.getStackTrace();},getDetails:function(){return apiError.getDetails();},getCode:function(){return apiError.getCode();},getId:function(){return apiError.getId();}};delegate.cause=getSafeCause(options);delegate.notifyOff=options.notifyOff||false;toRet=new SuiteScriptError(delegate);}
if(options.userFacing!==undefined&&options.userFacing!==null){toRet.userFacing=options.userFacing;}
return toRet;}
return Object.freeze({create:createError,Type:ERROR_TYPES});});define('N/util',[],function(){return util;});define('N/log',[],function(){return log;});define('N/restricted/fileApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/utilityFunctionsImpl',[],function()
{var serverCallSyncImpl=null;var serverCallAsyncImpl=null;if(typeof serverCallSync!=='undefined'){serverCallSyncImpl=serverCallSync;}
else{var global=(function(){return this;})();serverCallSyncImpl=global.serverCallSync;}
if(typeof serverCallAsync!=='undefined'){serverCallAsyncImpl=serverCallAsync;}
else{var global=(function(){return this;})();serverCallAsyncImpl=global.serverCallAsync;}
return{serverCall:serverCallSyncImpl,serverCallAsync:serverCallAsyncImpl};});define('N/restricted/invoker',['N/error'],function(error)
{var callURL='/app/common/scripting/ClientScriptHandler.nl?';var platformRequestURL='/app/common/scripting/PlatformClientScriptHandler.nl?';var needsFirstArg=['nlapiLoadRecord','loadRecord','nlapiCreateRecord','createRecord','nlapiCopyRecord','copyRecord','nlapiTransformRecord','transformRecord','nlapiSubmitField','nlapiDeleteRecord','nlapiSearchRecord','executeAction'];function checkForCharge(target,method,args,governanceOverride)
{if(!!target&&target.hasOwnProperty("chargeUsage"))
{var type;if(method==="nlapiSubmitRecord")
type=args[0].getRecordType()
else if(!!args&&needsFirstArg.indexOf(method)!=-1)
type=args[0];else
type=null;target["chargeUsage"].apply(this,[method,type,args,governanceOverride]);}}
function tryParsing(data)
{var parsedData={};try
{parsedData=JSON.parse(data);}
catch(e)
{return data;}
return parsedData;}
return function invokeOn(target,method,args,callback,parseResult)
{var result;var governanceOverride;parseResult=parseResult===undefined||!!parseResult;if(!!target&&(typeof target[method]!=="undefined"))
{try
{result=target[method].apply(target,args);}
catch(e)
{var exception=error.create(e);if(!util.isFunction(callback))
throw exception;else
return callback(undefined,exception);}
if(!util.isFunction(callback))
return result;else
return callback(result);}
else
{try
{var bridge=!!target?target.bridge:null;var targetURL=!!bridge?platformRequestURL:callURL;if(args===undefined||args===null)
args=[];if(!util.isFunction(callback))
{if(!!bridge)
{result=serverCallSync(targetURL,"bridgeCall",[bridge,method].concat(JSON.stringify(args)));governanceOverride=result.governance;result=result.result;}
else
result=serverCallSync(targetURL,method,args);if(parseResult)
{result=tryParsing(result);}
checkForCharge(target,method,args,governanceOverride);}
else
{var scriptRun;if(typeof document!=="undefined"&&typeof target["getScript"]!=="undefined")
{scriptRun=target["getScript"].apply(target,[]);}
var myCallback=function(response)
{if(typeof document!=='undefined'&&!!scriptRun&&typeof target["recoverScript"]!=="undefined")
{target["recoverScript"].apply(target,[scriptRun]);window.NLScriptId=scriptRun.scriptId;}
var result,exception;if(response instanceof Error)
{exception=error.create(response);}
else
{if(response.hasOwnProperty("nlError")&&response.nlError)
{exception=error.create({name:response.code,message:response.details});}
else
{result=response.result;if(!!bridge)
{governanceOverride=result.governance;result=result.result;}
if(parseResult)
{result=tryParsing(result);}
checkForCharge(target,method,args,governanceOverride);}}
return callback(result,exception);};if(!!bridge)
serverCallAsync(targetURL,"bridgeCall",[bridge,method].concat(JSON.stringify(args)),myCallback);else
serverCallAsync(targetURL,method,args,myCallback);}}
catch(e)
{var exception=error.create(e);if(!util.isFunction(callback))
throw exception;else
return callback(undefined,exception);}}
return result;};});define('N/utilityFunctions',['N/utilityFunctionsImpl','N/error','N/restricted/invoker','N/restricted/remoteApiBridge'],function(utilImpl,error,invoker,remoteApi)
{function getGlobalScope()
{return(function(){return this;}());}
function isObject(obj)
{return obj===Object(obj);}
function isValEmpty(val)
{if(val===null||val===undefined)
return true;val=String(val);return(val.length===0)||!/\S/.test(val);}
function isEmpty(val)
{if(val===null||val===undefined)
return true;val=String(val);return val.length===0;}
function isInternalErrorCode(errorCode)
{for(var code in error.Type)
{if(error.Type[code]===errorCode)
return true;}
return false;}
function getErrorMessage(errorCode,errorVal1,errorVal2,errorVal3,errorVal4)
{return invoker(remoteApi,'getErrorMessage',[errorCode,errorVal1,errorVal2,errorVal3,errorVal4]);}
function throwSuiteScriptError(errorCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4,internalErrorMessageCode)
{var message="";if(internalErrorMessageCode!=null)
message=getErrorMessage(internalErrorMessageCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4);else if(isInternalErrorCode(errorCode))
message=getErrorMessage(errorCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4);throw error.create({name:errorCode,message:message});}
function createSuiteScriptError(errorCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4,internalErrorMessageCode)
{var message="";if(internalErrorMessageCode!=null)
message=getErrorMessage(internalErrorMessageCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4);else if(isInternalErrorCode(errorCode))
message=getErrorMessage(errorCode,errorMessageVal1,errorMessageVal2,errorMessageVal3,errorMessageVal4);return error.create({name:errorCode,message:message});}
function checkArgs(funcArgs,funcArgNames,funcName)
{for(var i=0;i<funcArgs.length;i++)
{if(!funcArgs[i]&&funcArgs[i]!==0)
throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,funcName?funcName:'',funcArgNames[i]);}}
function checkArgsPresent(funcArgs,funcArgNames,funcName)
{for(var i=0;i<funcArgs.length;i++)
{if(funcArgs[i]==null)
throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,funcName?funcName:'',funcArgNames[i]);}}
function checkArgsAllowNull(funcArgs,funcArgNames,funcName)
{for(var i=0;i<funcArgs.length;i++)
{if(!funcArgs[i]&&funcArgs[i]!==0&&funcArgs[i]!==null)
throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,funcName?funcName:'',funcArgNames[i]);}}
function assertTrue(expression,errorCode,errorMessageVal1,errorMessageVal2)
{if(!expression)
throwSuiteScriptError(errorCode,errorMessageVal1,errorMessageVal2);}
function checkMutuallyExclusiveArguments(arg1,arg2,arg1Name,arg2Name)
{if(arg1!=undefined&&arg2!=undefined)
throwSuiteScriptError(error.Type.MUTUALLY_EXCLUSIVE_ARGUMENTS,arg1Name,arg2Name);}
function freezeObjectIfPossible(obj)
{return(Object.freeze&&(obj||obj===""||obj===0))?Object.freeze(obj):obj;}
function wrapDelegates(array,type)
{return(array&&array.map)?array.map(function(el,idx,arr)
{return new type(el);}):null;}
function arrayIndexOf(array,val,ignoreCase)
{for(var i=0;array&&i<array.length;i++)
{if(val===array[i]||(ignoreCase&&val&&array[i]&&val.toLowerCase()===array[i].toLowerCase()))
return i;}
return-1;}
function assignDefaultOrCurrentValue(arg,defaultVal)
{return arg||arg===0||arg===false?arg:defaultVal;}
function checkArgTypes(checkArgObjectArray)
{for(var i=0;i<checkArgObjectArray.length;i++)
{var current=checkArgObjectArray[i];if((current.value||current.value===0||current.value===false)&&((util.isNumber(current.value)&&isNaN(current.value))||!current.verifyFunction(current.value)))
{throwSuiteScriptError(error.Type.SSS_INVALID_TYPE_ARG,current.name);}}}
function checkArgObject(value,name,verifyFunction)
{return{value:value,name:name,verifyFunction:verifyFunction};}
var serverCall=function(url,methodName,args)
{return utilImpl.serverCall(url,methodName,args);};serverCall.promise=function(url,methodName,args)
{var myPromise=new Promise(function(resolve,reject)
{try
{utilImpl.serverCallAsync(url,methodName,args,function(response)
{(response instanceof Error)?reject(response):resolve(response);});}
catch(e)
{reject(e);}});return myPromise;};function unmarshalArray(payloadMap,prefix,unmarshalFunction)
{var array=[];var count=payloadMap[prefix+'count'];for(var i=0;i<count;++i)
{var attributeMap=payloadMap[prefix+i];var obj=unmarshalFunction(attributeMap);array.push(obj);}
return array;}
function arrayToMap(array,func)
{var result=[];for(var i=0;i<array.length;++i)
{result.push(func(array[i]));}
return result;}
function assertArrayElementsOfSameType(array,type,argName,errorCode)
{if(!util.isArray(array))
return;for(var i=0;i<array.length;i++)
{assertTrue(isElementSameType(array[i],type),errorCode||'SSS_INVALID_ARRAY_ARGUMENT',argName+'['+i+']');}}
function isElementSameType(element,type)
{return(element||element===0)&&((type===Object(type)&&element instanceof type)||typeof element===type||(element.constructor&&element.constructor.name&&element.constructor.name===type));}
function normalizeArrayOrSingularObjectArg(arg)
{return util.isArray(arg)?arg:arg!=undefined?[arg]:null;}
function arrayContains(array,val)
{return arrayIndexOf(array,val)>=0;}
function arrayAdd(array,val)
{if(!arrayContains(array,val))
array.push(val);}
function addParameterToMap(map,params)
{if(!map)
map={};for(var key in params)
{if(params.hasOwnProperty(key))
map[key]=params[key];}
return map;}
function augmentArguments(args,keyName,keyValue)
{var returnMe=args;if(!!returnMe)
{if(returnMe.length>1||!isObject(returnMe[0]))
Array.prototype.push.call(returnMe,keyValue);else if(isObject(returnMe[0]))
returnMe[0][keyName]=keyValue;}
return returnMe;}
function returnEmptyIfNull(str)
{return str!=null?str:"";}
function getAsArray(arg)
{return arg!=null?(util.isArray(arg)?arg:[arg]):null;}
function addReadOnlyProperty(target,propertyName,getter)
{Object.defineProperty(target,propertyName,{get:function()
{return getter();},set:function()
{throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,propertyName);},enumerable:true,configurable:false});}
function addReadOnlyNonEnumerableProperty(target,propertyName,getter)
{Object.defineProperty(target,propertyName,{get:function()
{return getter();},set:function()
{throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,propertyName);},enumerable:false,configurable:false});}
function promiseTo(fn,params,postProcess)
{return new Promise(function(resolve,reject)
{var callback=function(result,exception)
{if(exception)
{reject(exception);return;}
resolve(util.isFunction(postProcess)?postProcess({result:result,data:this}):result);};callback.promiseCallback=true;try
{fn.apply(callback,Array.prototype.slice.call(params));}
catch(e)
{reject(e);}});}
function isPromiseCallback(options)
{return util.isFunction(options)&&options.promiseCallback;}
function deepFreeze(obj)
{if(typeof obj[p]!=="object")
return obj;for(var p in obj)
{if(!obj.hasOwnProperty(p)||typeof obj[p]!=="object")
continue;return deepFreeze(obj[p]);}
return Object.freeze(obj);}
return Object.freeze({getGlobalScope:getGlobalScope,isObject:isObject,isValEmpty:isValEmpty,isEmpty:isEmpty,assignDefaultOrCurrentValue:assignDefaultOrCurrentValue,checkArgTypes:checkArgTypes,checkArgObject:checkArgObject,wrapDelegates:wrapDelegates,freezeObjectIfPossible:freezeObjectIfPossible,isInternalErrorCode:isInternalErrorCode,getErrorMessage:getErrorMessage,throwSuiteScriptError:throwSuiteScriptError,createSuiteScriptError:createSuiteScriptError,arrayIndexOf:arrayIndexOf,arrayContains:arrayContains,arrayAdd:arrayAdd,checkArgs:checkArgs,checkArgsPresent:checkArgsPresent,checkArgsAllowNull:checkArgsAllowNull,assertTrue:assertTrue,checkMutuallyExclusiveArguments:checkMutuallyExclusiveArguments,serverCall:serverCall,unmarshalArray:unmarshalArray,arrayToMap:arrayToMap,assertArrayElementsOfSameType:assertArrayElementsOfSameType,normalizeArrayOrSingularObjectArg:normalizeArrayOrSingularObjectArg,addParameterToMap:addParameterToMap,augmentArguments:augmentArguments,returnEmptyIfNull:returnEmptyIfNull,getAsArray:getAsArray,addReadOnlyProperty:addReadOnlyProperty,addReadOnlyNonEnumerableProperty:addReadOnlyNonEnumerableProperty,promiseTo:promiseTo,isPromiseCallback:isPromiseCallback,deepFreeze:deepFreeze});});define('N/creationFunctionWrapper',[],function(){function ReflectiveSetterProxy(target){return(function init(target){if(!target||target===this)
return target;var proxy=null;if(util.isFunction(target)&&target.prototype&&target.prototype.hasOwnProperty){proxy=function(){var targetFunction=target;var retMe=targetFunction.apply(this,arguments);var options=arguments[0];for(var p in options)
{if(options.hasOwnProperty(p))
{var value=options[p];if(retMe.hasOwnProperty(p)&&!util.isFunction(retMe[p])&&retMe[p]!=value)
{try
{retMe[p]=value;}
catch(err)
{if(err.name!=='READ_ONLY_PROPERTY')
{throw err;}}}}}
return retMe;};proxy.toString=function(){return '';};}
else if(Object.prototype.toString.call(target)==='[object Object]'&&target.hasOwnProperty){proxy={};proxyObjChildren(target,proxy);}
else
proxy=target;function proxyObjChildren(target,proxy){for(var p in target)
if(target.hasOwnProperty(p))
proxy[p]=init(target[p]);}
return proxy;})(target);};function wrapFunction(f){return new ReflectiveSetterProxy(f);}
return Object.freeze({wrap:wrapFunction});});define('N/common/pattern/iterator',['N/nsobject','N/utilityFunctions'],function(nsObject,utilityFunctions)
{function Iterator(delegate)
{this.next=function next()
{var result={done:!delegate.hasNext()};if(!result.done)
{result.value=delegate.next();}
return result;};this.each=function each(iteratorFunction)
{utilityFunctions.checkArgs([iteratorFunction],['iteratorFunction'],'Iterator.each');var cont=true;while(delegate.hasNext()&&cont)
{cont=!!iteratorFunction({value:delegate.next()});}};}
Iterator.prototype=nsObject.getNewInstance();return Object.freeze({create:function create(iterable)
{return Object.freeze(new Iterator(iterable));}});});define('N/file',['N/restricted/fileApi','N/error','N/nsobject','N/utilityFunctions','N/restricted/invoker','N/creationFunctionWrapper','N/common/pattern/iterator'],function(fileApi,error,nsobject,utilityFunctions,invoker,funcWrapper,iteratorFactory)
{var FILE_TYPES=Object.freeze({APPCACHE:'APPCACHE',AUTOCAD:'AUTOCAD',BMPIMAGE:'BMPIMAGE',CERTIFICATE:'CERTIFICATE',CONFIG:'CONFIG',CSV:'CSV',EXCEL:'EXCEL',FLASH:'FLASH',FREEMARKER:'FREEMARKER',GIFIMAGE:'GIFIMAGE',GZIP:'GZIP',HTMLDOC:'HTMLDOC',ICON:'ICON',JAVASCRIPT:'JAVASCRIPT',JPGIMAGE:'JPGIMAGE',JSON:'JSON',MESSAGERFC:'MESSAGERFC',MP3:'MP3',MPEGMOVIE:'MPEGMOVIE',MSPROJECT:'MSPROJECT',PDF:'PDF',PJPGIMAGE:'PJPGIMAGE',PLAINTEXT:'PLAINTEXT',PNGIMAGE:'PNGIMAGE',POSTSCRIPT:'POSTSCRIPT',POWERPOINT:'POWERPOINT',QUICKTIME:'QUICKTIME',RTF:'RTF',SCSS:'SCSS',SMS:'SMS',STYLESHEET:'STYLESHEET',SVG:'SVG',TAR:'TAR',TIFFIMAGE:'TIFFIMAGE',VISIO:'VISIO',WEBAPPPAGE:'WEBAPPPAGE',WEBAPPSCRIPT:'WEBAPPSCRIPT',WORD:'WORD',XMLDOC:'XMLDOC',XSD:'XSD',ZIP:'ZIP'});var ENCODINGS=Object.freeze({UTF_8:'UTF-8',WINDOWS_1252:'windows-1252',ISO_8859_1:'ISO-8859-1',GB18030:'GB18030',SHIFT_JIS:'SHIFT_JIS',MAC_ROMAN:'MacRoman',GB2312:'GB2312',BIG5:'Big5'});var fileLinesObjectsCreated=[];function File(delegate,folder)
{var TYPE='file.File';Object.defineProperty(this,'id',{get:function()
{return delegate.getId();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'id');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'size',{get:function()
{return delegate.getSize();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'size');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'url',{get:function()
{return delegate.getURL();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'url');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'path',{get:function()
{return delegate.getPath();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'path');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'fileType',{get:function()
{return delegate.getType();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'fileType');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'isText',{get:function()
{return delegate.isText();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isText');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'encoding',{get:function()
{return delegate.getEncoding();},set:function(val)
{delegate.setEncoding(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'name',{get:function()
{return delegate.getName();},set:function(val)
{delegate.setName(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'folder',{get:function()
{return delegate.getFolder();},set:function(val)
{delegate.setFolder(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'description',{get:function()
{return delegate.getDescription();},set:function(val)
{delegate.setDescription(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'isInactive',{get:function()
{return delegate.isInactive();},set:function(val)
{delegate.setIsInactive(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'isOnline',{get:function()
{return delegate.isOnline();},set:function(val)
{delegate.setIsOnline(val);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'lines',{get:function()
{return Object.freeze({iterator:function iterator()
{var fileContents=invoker(delegate,'createStreamingFileContents',[]);var fileLines=new FileLines(fileContents);fileLinesObjectsCreated.push(fileLines);return iteratorFactory.create(fileLines);}});},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'output');},enumerable:true,configurable:false});Object.defineProperty(this,'_writeTo',{set:function(val)
{invoker(val.delegate,'writeFile',[delegate,val.isInline?true:false]);},enumerable:false,configurable:false,writeable:true});Object.defineProperty(this,'_sd',{set:function(val)
{if(val.toString()==='task.CsvImportTask')
val._fd=delegate;else if(val.toString()==='FileDelegateContainer')
val.set(delegate);},enumerable:false,configurable:false,writeable:true});Object.defineProperty(this,'_upload',{set:function(val)
{invoker(val.delegate,'upload',[delegate,val.filename,val.directory,val.timeout,val.replace])},enumerable:false,configurable:false,writeable:true});Object.defineProperty(this,'_saveBankStatementFile',{set:function(val)
{invoker(val.delegate,'saveBankStatementFile',[delegate,val.bankStatementFormat])},enumerable:false,configurable:false,writeable:true});this.getContents=function getContents()
{return invoker(delegate,'getValue',[]);};this.save=function save()
{if(delegate.getFolder()==-1)
utilityFunctions.throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,'file.File.save','folder');return invoker(fileApi,'nlapiSubmitFile',[delegate]);};this.append=function append(options)
{utilityFunctions.checkArgs([options],['options'],'file.append');utilityFunctions.checkArgs([options.value],['options.value'],'file.append');invoker(delegate,'append',[options.value]);return this;};this.appendLine=function appendLine(options)
{utilityFunctions.checkArgs([options],['options'],'file.appendLine');utilityFunctions.checkArgs([options.value],['options.value'],'file.appendLine');invoker(delegate,'appendLine',[options.value]);return this;};this.resetStream=function resetStream()
{invoker(delegate,'resetStream',[]);for(var i=0;i<fileLinesObjectsCreated.length;i++)
fileLinesObjectsCreated[i].reset();};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:TYPE,id:this.id,name:this.name,description:this.description,path:this.path,url:this.url,folder:this.folder,fileType:this.fileType,isText:this.isText,size:this.size,encoding:this.encoding,isInactive:this.isInactive,isOnline:this.isOnline};};Object.defineProperty(this,'_attachToEmail',{set:function(email)
{email._attach=delegate;},enumerable:false,configurable:false,writeable:true});if(folder!=null)
this.folder=folder;}
File.prototype=nsobject.getNewInstance();function FileLines(delegate)
{var nextLine=invoker(delegate,'nextLine',[]);this.hasNext=function hasNext()
{return nextLine!==null;};this.next=function next()
{var _nextLine=nextLine;nextLine=invoker(delegate,'nextLine',[]);return _nextLine;};this.reset=function reset(){invoker(delegate,'resetStream',[]);nextLine=invoker(delegate,'nextLine',[]);}}
function create(options)
{utilityFunctions.checkArgs([options],['options object'],'file.create');utilityFunctions.checkArgs([options.name,options.fileType,options.contents],['name','fileType','contents'],'file.create');return new File(invoker(fileApi,'nlapiCreateFile',[options.name,options.fileType,options.contents]),options.folder);}
return Object.freeze({create:funcWrapper.wrap(create),load:function load(options)
{var idOrPath=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([idOrPath],['id'],'file.load');return new File(invoker(fileApi,'nlapiLoadFile',[idOrPath]));},'delete':function(options)
{var id=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([id],['id'],'file.delete');invoker(fileApi,'nlapiDeleteFile',[id]);},wrap:function wrap(nlobj)
{return new File(nlobj);},Type:FILE_TYPES,Encoding:ENCODINGS});});define('N/xml',['N/file','N/error','N/nsobject','N/restricted/invoker','N/utilityFunctions','N/restricted/xmlApi'],function(file,error,nsobject,invoker,utilityFunctions,xmlApi)
{var NODE_TYPES=Object.freeze(['ELEMENT_NODE','ATTRIBUTE_NODE','TEXT_NODE','CDATA_SECTION_NODE','ENTITY_REFERENCE_NODE','ENTITY_NODE','PROCESSING_INSTRUCTION_NODE','COMMENT_NODE','DOCUMENT_NODE','DOCUMENT_TYPE_NODE','DOCUMENT_FRAGMENT_NODE','NOTATION_NODE']);var NODE_TYPES_ENUM=Object.freeze({ELEMENT_NODE:'ELEMENT_NODE',ATTRIBUTE_NODE:'ATTRIBUTE_NODE',TEXT_NODE:'TEXT_NODE',CDATA_SECTION_NODE:'CDATA_SECTION_NODE',ENTITY_REFERENCE_NODE:'ENTITY_REFERENCE_NODE',ENTITY_NODE:'ENTITY_NODE',ENTITY_NODE:'ENTITY_NODE',PROCESSING_INSTRUCTION_NODE:'PROCESSING_INSTRUCTION_NODE',COMMENT_NODE:'COMMENT_NODE',DOCUMENT_NODE:'DOCUMENT_NODE',DOCUMENT_TYPE_NODE:'DOCUMENT_TYPE_NODE',DOCUMENT_FRAGMENT_NODE:'DOCUMENT_FRAGMENT_NODE',NOTATION_NODE:'NOTATION_NODE'});var IE_CONVERSIONS=Object.freeze({getTextContent:'text',getLocalName:'baseName'});var CLIENT_SIDE_ATTR=Object.freeze({getName:'name',getOwnerElement:'ownerElement',getSpecified:'specified',getValue:'value',setValue:'value',getDoctype:'doctype',getDocumentElement:'documentElement',getDocumentURI:'documentURI',setDocumentURI:'documentURI',getInputEncoding:'inputEncoding',getXmlEncoding:'xmlEncoding',getXmlStandalone:'xmlStandalone',setXmlStandalone:'xmlStandalone',getXmlVersion:'xmlVersion',setXmlVersion:'xmlVersion',getAttributes:'attributes',getBaseURI:'baseURI',getFirstChild:'firstChild',getLastChild:'lastChild',getLocalName:'localName',getNamespaceURI:'namespaceURI',getNextSibling:'nextSibling',getNodeName:'nodeName',getNodeType:'nodeType',getNodeValue:'nodeValue',setNodeValue:'nodeValue',getOwnerDocument:'ownerDocument',getParentNode:'parentNode',getPrefix:'prefix',setPrefix:'prefix',getPreviousSibling:'previousSibling',getTextContent:'textContent',setTextContent:'textContent'});function checkThenInvoke(target,method,args)
{if(method==="getBaseURI"||method==="getDocumentURI")
return null;var targetMethodType=typeof target[method];if(targetMethodType==="undefined")
{if(window&&!window.XPathEvaluator&&IE_CONVERSIONS.hasOwnProperty(method))
return target[IE_CONVERSIONS[method]];if(CLIENT_SIDE_ATTR.hasOwnProperty(method))
{if(method.indexOf("set")===0)
return target[CLIENT_SIDE_ATTR[method]]=args[0];else
return target[CLIENT_SIDE_ATTR[method]];}
else
{return undefined;}}
if(typeof window!=="undefined"&&!window.XPathEvaluator)
{switch(args.length)
{case 0:return target[method]();case 1:return target[method](args[0]);case 2:return target[method](args[0],args[1]);case 3:return target[method](args[0],args[1],args[2]);case 4:return target[method](args[0],args[1],args[2],args[3]);default:return target[method](args[0],args[1],args[2],args[3],args[4]);}}
else
{try
{return invoker(target,method,args)}
catch(e)
{if(e.name==="NotFoundError")
{e=Error(e.message);e.name="SSS_XML_DOM_EXCEPTION";}
throw e;}}}
function Parser()
{this.fromString=function fromString(options)
{var text=(options&&options.hasOwnProperty('text'))?options.text:options;checkArgs([text],['text'],'Parser.fromString');assertString(text,'text');var document=invoker(xmlApi,'nlapiStringToXML',[text]);return new Document(document);};this.toString=function toString(options)
{var document=(options&&options.hasOwnProperty('document'))?options.document:options;checkArgs([document],['document'],'Parser.toString');if(!(document instanceof Document))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'document','xml.Document');return document._asString();};}
function XPath()
{this.select=function select(options)
{var node=null,xpath=null;if(options&&(options.hasOwnProperty('node')||options.hasOwnProperty('xpath')))
{node=options.node;xpath=options.xpath;}
else
{node=options;xpath=arguments[1];}
checkArgs([node,xpath],['node','xpath'],'XPath.select');assertNode(node,'node');assertString(xpath,'xpath');var nodes=invoker(xmlApi,'nlapiSelectNodes',[node._gd(),xpath]);var result=[];for(var i=0;i<nodes.length;i++)
{result.push(wrap(nodes[i]));}
return result;};}
function Node(xmlnode)
{var TYPE='xml.Node';checkArgs([xmlnode],['xmlnode'],'xml.Node');var _deleg=xmlnode;this.appendChild=function appendChild(options)
{var newChild=(options&&options.hasOwnProperty('newChild'))?options.newChild:options;checkArgs([newChild],['newChild'],'Node.appendChild');assertNode(newChild,'newChild');var result=checkThenInvoke(_deleg,'appendChild',[newChild._gd()]);return wrap(result);};this.cloneNode=function cloneNode(options)
{var deep=(options&&options.hasOwnProperty('deep'))?options.deep:options;checkArgs([deep],['deep'],'Node.cloneNode');var result=checkThenInvoke(_deleg,'cloneNode',[deep==true]);return wrap(result);};this.compareDocumentPosition=function compareDocumentPosition(options)
{var other=(options&&options.hasOwnProperty('other'))?options.other:options;checkArgs([other],['other'],'Node.compareDocumentPosition');assertNode(other,'other');return checkThenInvoke(_deleg,'compareDocumentPosition',[other._gd()]);};this.hasAttributes=function hasAttributes()
{return checkThenInvoke(_deleg,'hasAttributes',[]);};this.hasChildNodes=function hasChildNodes()
{return checkThenInvoke(_deleg,'hasChildNodes',[]);};this.insertBefore=function insertBefore(options)
{var newChild=null,refChild=null;if(options&&(options.hasOwnProperty('newChild')||options.hasOwnProperty('refChild')))
{newChild=options.newChild;refChild=options.refChild;}
else
{newChild=options;refChild=arguments[1];}
checkArgs([newChild],['newChild'],'Node.insertBefore');assertNode(newChild,'newChild');assertNodeNullable(refChild,'refChild');var result=checkThenInvoke(_deleg,'insertBefore',[newChild._gd(),refChild==null?null:refChild._gd()]);return wrap(result);};this.isDefaultNamespace=function isDefaultNamespace(options)
{var namespaceURI=(options&&options.hasOwnProperty('namespaceURI'))?options.namespaceURI:options;checkArgs([namespaceURI],['namespaceURI'],'Node.isDefaultNamespace');assertString(namespaceURI,'namespaceURI');return checkThenInvoke(_deleg,'isDefaultNamespace',[namespaceURI]);};this.isEqualNode=function isEqualNode(options)
{var other=(options&&options.hasOwnProperty('other'))?options.other:options;checkArgs([other],['other'],'Node.isEqualNode');assertNode(other,'other');return checkThenInvoke(_deleg,'isEqualNode',[other._gd()]);};this.isSameNode=function isSameNode(options)
{var other=(options&&options.hasOwnProperty('other'))?options.other:options;checkArgs([other],['other'],'Node.isSameNode');assertNode(other,'other');return checkThenInvoke(_deleg,'isSameNode',[other._gd()]);};this.lookupNamespaceURI=function lookupNamespaceURI(options)
{var prefix=(options&&options.hasOwnProperty('prefix'))?options.prefix:options;assertStringNullable(prefix,'prefix');return checkThenInvoke(_deleg,'lookupNamespaceURI',[prefix==null?null:prefix]);};this.lookupPrefix=function lookupPrefix(options)
{var namespaceURI=(options&&options.hasOwnProperty('namespaceURI'))?options.namespaceURI:options;checkArgs([namespaceURI],['namespaceURI'],'Node.lookupPrefix');assertString(namespaceURI,'namespaceURI');return checkThenInvoke(_deleg,'lookupPrefix',[namespaceURI]);};this.normalize=function normalize()
{checkThenInvoke(_deleg,'normalize',[]);};this.removeChild=function removeChild(options)
{var oldChild=(options&&options.hasOwnProperty('oldChild'))?options.oldChild:options;checkArgs([oldChild],['oldChild'],'Node.removeChild');assertNode(oldChild,'oldChild');var result=checkThenInvoke(_deleg,'removeChild',[oldChild._gd()]);return wrap(result);};this.replaceChild=function replaceChild(options)
{var newChild=null,oldChild=null;if(options&&(options.hasOwnProperty('newChild')||options.hasOwnProperty('oldChild')))
{newChild=options.newChild;oldChild=options.oldChild;}
else
{newChild=options;oldChild=arguments[1];}
checkArgs([newChild,oldChild],['newChild','oldChild'],'Node.replaceChild');assertNode(newChild,'newChild');assertNode(oldChild,'oldChild');var result=checkThenInvoke(_deleg,'replaceChild',[newChild._gd(),oldChild._gd()]);return wrap(result);};Object.defineProperty(this,'attributes',{get:function()
{var attrs=checkThenInvoke(_deleg,'getAttributes',[]);if(!attrs)
return null;var result={};for(i=0;i<attrs.length;i++)
{var item=attrs.item(i);var node=new Attr(item);result[node.name.replace(':','_')]=node;}
return result;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'attributes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'baseURI',{get:function()
{return checkThenInvoke(_deleg,'getBaseURI',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'baseURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'childNodes',{get:function()
{var result=[];var child=this.firstChild;while(child!==null)
{result.push(child);child=child.nextSibling;}
return result;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'childNodes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'firstChild',{get:function()
{var result=checkThenInvoke(_deleg,'getFirstChild',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'firstChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'lastChild',{get:function()
{var result=checkThenInvoke(_deleg,'getLastChild',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'lastChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'localName',{get:function()
{return checkThenInvoke(_deleg,'getLocalName',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'localName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'namespaceURI',{get:function()
{return checkThenInvoke(_deleg,'getNamespaceURI',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'namespaceURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nextSibling',{get:function()
{var result=checkThenInvoke(_deleg,'getNextSibling',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nextSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeName',{get:function()
{return checkThenInvoke(_deleg,'getNodeName',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeType',{get:function()
{var result=checkThenInvoke(_deleg,'getNodeType',[]);return NODE_TYPES[result-1];},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeType');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeValue',{get:function()
{return checkThenInvoke(_deleg,'getNodeValue',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setNodeValue',[val]);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'ownerDocument',{get:function()
{var result=checkThenInvoke(_deleg,'getOwnerDocument',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'ownerDocument');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'parentNode',{get:function()
{var result=checkThenInvoke(_deleg,'getParentNode',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'parentNode');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'prefix',{get:function()
{return checkThenInvoke(_deleg,'getPrefix',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setPrefix',[val]);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'previousSibling',{get:function()
{var result=checkThenInvoke(_deleg,'getPreviousSibling',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'previousSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'textContent',{get:function()
{return checkThenInvoke(_deleg,'getTextContent',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setTextContent',[val]);},enumerable:true,configurable:false,writeable:true});this._gd=function _gd()
{return _deleg;};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{name:this.nodeName,type:this.nodeType,value:this.nodeValue,textContent:this.textContent};};}
Node.prototype=nsobject.getNewInstance();function Document(xmldoc)
{var TYPE='xml.Document';checkArgs([xmldoc],['xmldoc'],'xml.Document');var _deleg=xmldoc;var _node=new Node(xmldoc);this.adoptNode=function adoptNode(options)
{var source=(options&&options.hasOwnProperty('source'))?options.source:options;checkArgs([source],['source'],'Document.adoptNode');assertNode(source,'source');var result=checkThenInvoke(_deleg,'adoptNode',[source._gd()]);return wrap(result);};this.createAttribute=function createAttribute(options)
{var name=null,value=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('value')))
{name=options.name;value=options.value;}
else
{name=options;value=arguments[1];}
checkArgs([name],['name'],'Node.createAttribute');assertString(name,'name');var result=checkThenInvoke(_deleg,'createAttribute',[name]);result=new Attr(result);if(value)
{assertString(value,'value');result.value=value;}
return result;};this.createAttributeNS=function createAttributeNS(options)
{var namespaceURI=null,qualifiedName=null,value=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('qualifiedName')||options.hasOwnProperty('value')))
{namespaceURI=options.namespaceURI;qualifiedName=options.qualifiedName;value=options.value;}
else
{namespaceURI=options;qualifiedName=arguments[1];value=arguments[2];}
checkArgs([qualifiedName],['qualifiedName'],'Document.createAttributeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(qualifiedName,'qualifiedName');var result=checkThenInvoke(_deleg,'createAttributeNS',[namespaceURI==null?null:namespaceURI,qualifiedName]);result=new Attr(result);if(value)
{assertString(value,'value');result.value=value;}
return result;};this.createCDATASection=function createCDATASection(options)
{var data=(options&&options.hasOwnProperty('data'))?options.data:options;checkArgs([data],['data'],'Document.createCDATASection');assertString(data,'data');var result=checkThenInvoke(_deleg,'createCDATASection',[data]);return new Node(result);};this.createComment=function createComment(options)
{var data=(options&&options.hasOwnProperty('data'))?options.data:options;checkArgs([data],['data'],'Document.createComment');assertString(data,'data');var result=checkThenInvoke(_deleg,'createComment',[data]);return new Node(result);};this.createDocumentFragment=function createDocumentFragment()
{var result=checkThenInvoke(_deleg,'createDocumentFragment',[]);return new Node(result);};this.createElement=function createElement(options)
{var tagName=(options&&options.hasOwnProperty('tagName'))?options.tagName:options;checkArgs([tagName],['tagName'],'Document.createElement');assertString(tagName,'tagName');var result=checkThenInvoke(_deleg,'createElement',[tagName]);return new Element(result);};this.createElementNS=function createElementNS(options)
{var namespaceURI=null,qualifiedName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('qualifiedName')))
{namespaceURI=options.namespaceURI;qualifiedName=options.qualifiedName;}
else
{namespaceURI=options;qualifiedName=arguments[1];}
checkArgs([qualifiedName],['qualifiedName'],'Document.createElementNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(qualifiedName,'qualifiedName');var result=checkThenInvoke(_deleg,'createElementNS',[namespaceURI==null?null:namespaceURI,qualifiedName]);return new Element(result);};this.createProcessingInstruction=function createProcessingInstruction(options)
{var target=null,data=null;if(options&&(options.hasOwnProperty('target')||options.hasOwnProperty('data')))
{target=options.target;data=options.data;}
else
{target=options;data=arguments[1];}
checkArgs([target,data],['target','data'],'Document.createProcessingInstruction');assertString(target,'target');assertString(data,'data');var result=checkThenInvoke(_deleg,'createProcessingInstruction',[target,data]);return new Node(result);};this.createTextNode=function createTextNode(options)
{var data=(options&&options.hasOwnProperty('data'))?options.data:options;checkArgs([data],['data'],'Document.createTextNode');assertString(data,'data');var result=checkThenInvoke(_deleg,'createTextNode',[data]);return new Node(result);};this.getElementById=function getElementById(options)
{var elementId=(options&&options.hasOwnProperty('elementId'))?options.elementId:options;checkArgs([elementId],['elementId'],'Document.getElementById');assertString(elementId,'elementId');var result=checkThenInvoke(_deleg,'getElementById',[elementId]);return new Element(result);};this.getElementsByTagName=function getElementsByTagName(options)
{var tagName=(options&&options.hasOwnProperty('tagName'))?options.tagName:options;checkArgs([tagName],['tagName'],'Document.getElementsByTagName');assertString(tagName,'tagName');var elems=checkThenInvoke(_deleg,'getElementsByTagName',[tagName]);var result=[];for(i=0;i<elems.length;i++)
{result.push(new Element(elems.item(i)));}
return result;};this.getElementsByTagNameNS=function getElementsByTagNameNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([namespaceURI,localName],['namespaceURI','localName'],'Document.getElementsByTagNameNS');assertString(namespaceURI,'namespaceURI');assertString(localName,'localName');var elems=checkThenInvoke(_deleg,'getElementsByTagNameNS',[namespaceURI,localName]);var result=[];for(i=0;i<elems.length;i++)
{result.push(new Element(elems.item(i)));}
return result;};this.importNode=function importNode(options)
{var importedNode=null,deep=null;if(options&&(options.hasOwnProperty('importedNode')||options.hasOwnProperty('deep')))
{importedNode=options.importedNode;deep=options.deep;}
else
{importedNode=options;deep=arguments[1];}
checkArgs([importedNode,deep],['importedNode','deep'],'Document.importNode');assertNode(importedNode,'importedNode');var result=checkThenInvoke(_deleg,'importNode',[importedNode._gd(),deep==true]);return wrap(result);};Object.defineProperty(this,'doctype',{get:function()
{var result=checkThenInvoke(_deleg,'getDoctype',[]);if(result===null||result===undefined)
return null;return new Node(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'doctype');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'documentElement',{get:function()
{var result=checkThenInvoke(_deleg,'getDocumentElement',[]);return new Element(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'documentElement');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'documentURI',{get:function()
{return checkThenInvoke(_deleg,'getDocumentURI',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setDocumentURI',[val]);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'inputEncoding',{get:function()
{return checkThenInvoke(_deleg,'getInputEncoding',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'inputEncoding');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'xmlEncoding',{get:function()
{return checkThenInvoke(_deleg,'getXmlEncoding',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'xmlEncoding');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'xmlStandalone',{get:function()
{return checkThenInvoke(_deleg,'getXmlStandalone',[]);},set:function(val)
{checkThenInvoke(_deleg,'setXmlStandalone',[val==true]);},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'xmlVersion',{get:function()
{return checkThenInvoke(_deleg,'getXmlVersion',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setXmlVersion',[val]);},enumerable:true,configurable:false,writeable:true});this.appendChild=function appendChild(options)
{return _node.appendChild(options);};this.cloneNode=function cloneNode(options)
{return _node.cloneNode(options);};this.compareDocumentPosition=function compareDocumentPosition(options)
{return _node.compareDocumentPosition(options);};this.hasChildNodes=function hasChildNodes()
{return _node.hasChildNodes();};this.insertBefore=function insertBefore()
{return _node.insertBefore.apply(_node,arguments);};this.isDefaultNamespace=function isDefaultNamespace(options)
{return _node.isDefaultNamespace(options);};this.isEqualNode=function isEqualNode(options)
{return _node.isEqualNode(options);};this.isSameNode=function isSameNode(options)
{return _node.isSameNode(options);};this.lookupNamespaceURI=function lookupNamespaceURI(options)
{return _node.lookupNamespaceURI(options);};this.lookupPrefix=function lookupPrefix(options)
{return _node.lookupPrefix(options);};this.normalize=function normalize()
{checkThenInvoke(_deleg,'normalizeDocument',[]);};this.removeChild=function removeChild(options)
{return _node.removeChild(options);};this.replaceChild=function replaceChild()
{return _node.replaceChild.apply(_node,arguments);};Object.defineProperty(this,'attributes',{get:function()
{return _node.attributes;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'attributes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'baseURI',{get:function()
{return _node.baseURI;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'baseURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'childNodes',{get:function()
{return _node.childNodes;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'childNodes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'firstChild',{get:function()
{return _node.firstChild;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'firstChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'lastChild',{get:function()
{return _node.lastChild;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'lastChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'localName',{get:function()
{return _node.localName;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'localName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'namespaceURI',{get:function()
{return _node.namespaceURI;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'namespaceURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nextSibling',{get:function()
{return _node.nextSibling;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nextSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeName',{get:function()
{return _node.nodeName;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeType',{get:function()
{return _node.nodeType;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeType');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeValue',{get:function()
{return _node.nodeValue;},set:function(val)
{_node.nodeValue=val;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'ownerDocument',{get:function()
{return _node.ownerDocument;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'ownerDocument');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'parentNode',{get:function()
{return _node.parentNode;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'parentNode');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'prefix',{get:function()
{return _node.prefix;},set:function(val)
{_node.prefix=val;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'previousSibling',{get:function()
{return _node.previousSibling;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'previousSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'textContent',{get:function()
{return _node.textContent;},set:function(val)
{_node.textContent=val;},enumerable:true,configurable:false,writeable:true});this._asString=function _asString()
{return invoker(xmlApi,'nlapiXMLToString',[_deleg]);};this._gd=function _gd()
{return _deleg;};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return _node.toJSON();};}
Document.prototype=nsobject.getNewInstance();function Element(xmlelem)
{var TYPE='xml.Element';checkArgs([xmlelem],['xmlelem'],'xml.Element');var _deleg=xmlelem;var _node=new Node(xmlelem);this.getAttribute=function getAttribute(options)
{var name=(options&&options.hasOwnProperty('name'))?options.name:options;checkArgs([name],['name'],'Element.getAttribute');assertString(name,'name');return checkThenInvoke(_deleg,'getAttribute',[name]);};this.getAttributeNode=function getAttributeNode(options)
{var name=(options&&options.hasOwnProperty('name'))?options.name:options;checkArgs([name],['name'],'Element.getAttributeNode');assertString(name,'name');var result=checkThenInvoke(_deleg,'getAttributeNode',[name]);return wrap(result);};this.getAttributeNodeNS=function getAttributeNodeNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([localName],['localName'],'Element.getAttributeNodeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(localName,'localName');var result=checkThenInvoke(_deleg,'getAttributeNodeNS',[namespaceURI==null?null:namespaceURI,localName]);return wrap(result);};this.getAttributeNS=function getAttributeNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([localName],['localName'],'Element.getAttributeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(localName,'localName');return checkThenInvoke(_deleg,'getAttributeNS',[namespaceURI==null?null:namespaceURI,localName]);};this.getElementsByTagName=function getElementsByTagName(options)
{var tagName=(options&&options.hasOwnProperty('tagName'))?options.tagName:options;checkArgs([tagName],['tagName'],'Element.getElementsByTagName');assertString(tagName,'tagName');var elems=checkThenInvoke(_deleg,'getElementsByTagName',[tagName]);var result=[];for(i=0;i<elems.length;i++)
{result.push(new Element(elems.item(i)));}
return result;};this.getElementsByTagNameNS=function getElementsByTagNameNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([namespaceURI,localName],['namespaceURI','localName'],'Element.getElementsByTagNameNS');assertString(namespaceURI,'namespaceURI');assertString(localName,'localName');var elems=checkThenInvoke(_deleg,'getElementsByTagNameNS',[namespaceURI,localName]);var result=[];for(i=0;i<elems.length;i++)
{result.push(new Element(elems.item(i)));}
return result;};this.hasAttribute=function hasAttribute(options)
{var name=(options&&options.hasOwnProperty('name'))?options.name:options;checkArgs([name],['name'],'Element.hasAttribute');assertString(name,'name');return checkThenInvoke(_deleg,'hasAttribute',[name]);};this.hasAttributeNS=function hasAttributeNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([localName],['localName'],'Element.hasAttributeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(localName,'localName');return checkThenInvoke(_deleg,'hasAttributeNS',[namespaceURI==null?null:namespaceURI,localName]);};this.removeAttribute=function removeAttribute(options)
{var name=(options&&options.hasOwnProperty('name'))?options.name:options;checkArgs([name],['name'],'Element.removeAttribute');assertString(name,'name');checkThenInvoke(_deleg,'removeAttribute',[name]);};this.removeAttributeNode=function removeAttributeNode(options)
{var oldAttr=(options&&options.hasOwnProperty('oldAttr'))?options.oldAttr:options;checkArgs([oldAttr],['oldAttr'],'Element.removeAttributeNode');assertNode(oldAttr,'oldAttr');var result=checkThenInvoke(_deleg,'removeAttributeNode',[oldAttr._gd()]);return wrap(result);};this.removeAttributeNS=function removeAttributeNS(options)
{var namespaceURI=null,localName=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('localName')))
{namespaceURI=options.namespaceURI;localName=options.localName;}
else
{namespaceURI=options;localName=arguments[1];}
checkArgs([localName],['localName'],'Element.removeAttributeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(localName,'localName');checkThenInvoke(_deleg,'removeAttributeNS',[namespaceURI==null?null:namespaceURI,localName]);};this.setAttribute=function setAttribute(options)
{var name=null,value=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('value')))
{name=options.name;value=options.value;}
else
{name=options;value=arguments[1];}
checkArgs([name,value],['name','value'],'Element.setAttribute');assertString(name,'name');assertString(value,'value');return checkThenInvoke(_deleg,'setAttribute',[name,value]);};this.setAttributeNode=function setAttributeNode(options)
{var newAttr=(options&&options.hasOwnProperty('newAttr'))?options.newAttr:options;checkArgs([newAttr],['newAttr'],'Element.setAttributeNode');assertNode(newAttr,'newAttr');var result=checkThenInvoke(_deleg,'setAttributeNode',[newAttr._gd()]);return wrap(result);};this.setAttributeNodeNS=function setAttributeNodeNS(options)
{var newAttr=(options&&options.hasOwnProperty('newAttr'))?options.newAttr:options;checkArgs([newAttr],['newAttr'],'Element.setAttributeNodeNS');assertNode(newAttr,'newAttr');var result=checkThenInvoke(_deleg,'setAttributeNodeNS',[newAttr._gd()]);return wrap(result);};this.setAttributeNS=function setAttributeNS(options)
{var namespaceURI=null,qualifiedName=null,value=null;if(options&&(options.hasOwnProperty('namespaceURI')||options.hasOwnProperty('qualifiedName')||options.hasOwnProperty('value')))
{namespaceURI=options.namespaceURI;qualifiedName=options.qualifiedName;value=options.value;}
else
{namespaceURI=options;qualifiedName=arguments[1];value=arguments[2];}
checkArgs([qualifiedName,value],['qualifiedName','value'],'Element.setAttributeNS');assertStringNullable(namespaceURI,'namespaceURI');assertString(qualifiedName,'qualifiedName');assertString(value,'value');return checkThenInvoke(_deleg,'setAttributeNS',[namespaceURI==null?null:namespaceURI,qualifiedName,value]);};Object.defineProperty(this,'tagName',{get:function()
{return checkThenInvoke(_deleg,'getTagName',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'tagName');},enumerable:true,configurable:false,writeable:false});this.appendChild=function appendChild(options)
{return _node.appendChild(options);};this.cloneNode=function cloneNode(options)
{return _node.cloneNode(options);};this.compareDocumentPosition=function compareDocumentPosition(options)
{return _node.compareDocumentPosition(options);};this.hasAttributes=function hasAttributes()
{return _node.hasAttributes();};this.hasChildNodes=function hasChildNodes()
{return _node.hasChildNodes();};this.insertBefore=function insertBefore()
{return _node.insertBefore.apply(_node,arguments);};this.isDefaultNamespace=function isDefaultNamespace(options)
{return _node.isDefaultNamespace(options);};this.isEqualNode=function isEqualNode(options)
{return _node.isEqualNode(options);};this.isSameNode=function isSameNode(options)
{return _node.isSameNode(options);};this.lookupNamespaceURI=function lookupNamespaceURI(options)
{return _node.lookupNamespaceURI(options);};this.lookupPrefix=function lookupPrefix(options)
{return _node.lookupPrefix(options);};this.normalize=function normalize()
{_node.normalize();};this.removeChild=function removeChild(options)
{return _node.removeChild(options);};this.replaceChild=function replaceChild()
{return _node.replaceChild.apply(_node,arguments);};Object.defineProperty(this,'attributes',{get:function()
{return _node.attributes;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'attributes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'baseURI',{get:function()
{return _node.baseURI;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'baseURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'childNodes',{get:function()
{return _node.childNodes;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'childNodes');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'firstChild',{get:function()
{return _node.firstChild;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'firstChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'lastChild',{get:function()
{return _node.lastChild;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'lastChild');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'localName',{get:function()
{return _node.localName;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'localName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'namespaceURI',{get:function()
{return _node.namespaceURI;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'namespaceURI');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nextSibling',{get:function()
{return _node.nextSibling;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nextSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeName',{get:function()
{return _node.nodeName;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeName');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeType',{get:function()
{return _node.nodeType;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'nodeType');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nodeValue',{get:function()
{return _node.nodeValue;},set:function(val)
{_node.nodeValue=val;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'ownerDocument',{get:function()
{return _node.ownerDocument;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'ownerDocument');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'parentNode',{get:function()
{return _node.parentNode;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'parentNode');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'prefix',{get:function()
{return _node.prefix;},set:function(val)
{_node.prefix=val;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'previousSibling',{get:function()
{return _node.previousSibling;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'previousSibling');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'textContent',{get:function()
{return _node.textContent;},set:function(val)
{_node.textContent=val;},enumerable:true,configurable:false,writeable:true});this._gd=function _gd()
{return _deleg;};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return _node.toJSON();};}
Element.prototype=nsobject.getNewInstance();function Attr(xmlattr)
{var TYPE='xml.Attr';checkArgs([xmlattr],['xmlattr'],'xml.Attr');var _deleg=xmlattr;Object.defineProperty(this,'name',{get:function()
{return checkThenInvoke(_deleg,'getName',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'ownerElement',{get:function()
{var result=checkThenInvoke(_deleg,'getOwnerElement',[]);return wrap(result);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'ownerElement');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'specified',{get:function()
{return checkThenInvoke(_deleg,'getSpecified',[]);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'specified');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'value',{get:function()
{return checkThenInvoke(_deleg,'getValue',[]);},set:function(val)
{assertString(val,'value');checkThenInvoke(_deleg,'setValue',[val]);},enumerable:true,configurable:false,writeable:true});this._gd=function _gd()
{return _deleg;};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{name:this.name,ownerElement:this.ownerElement,specified:this.specified,value:this.value};};}
Attr.prototype=nsobject.getNewInstance();function assertString(arg,argName)
{if(!isString(arg))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,argName,'string');}
function assertStringNullable(arg,argName)
{if(arg!=null)
assertString(arg,argName);}
function assertNode(arg,argName)
{if(!isNode(arg))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,argName,'xml.Node or subclass');}
function assertNodeNullable(arg,argName)
{if(arg!=null)
assertNode(arg,argName);}
function isString(obj)
{return Object.prototype.toString.call(obj)==='[object String]';}
function isNode(obj)
{return obj instanceof Node||obj instanceof Element||obj instanceof Attr||obj instanceof Document;}
function checkArgs(funcArgs,funcArgNames,funcName)
{for(var i=0;i<funcArgs.length;i++)
if(funcArgs[i]==null)
utilityFunctions.throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,(funcName?funcName+': ':''),funcArgNames[i]);}
function wrap(node)
{if(!node)
return node;switch(node.nodeType)
{case 1:return new Element(node);case 2:return new Attr(node);case 9:return new Document(node);default:return new Node(node);}}
function escape(options)
{var xmlText=(options&&options.hasOwnProperty('xmlText'))?options.xmlText:options;checkArgs([xmlText],['xmlText'],'escape');assertString(xmlText,'xmlText');return xmlText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');}
function validate(options)
{var xml=null,xsdFilePathOrId=null,importFolderPathOrId=null;if(options&&(options.hasOwnProperty('xml')||options.hasOwnProperty('xsdFilePathOrId')||options.hasOwnProperty('importFolderPathOrId')))
{xml=options.xml;xsdFilePathOrId=options.xsdFilePathOrId;importFolderPathOrId=options.importFolderPathOrId;}
else
{xml=options;xsdFilePathOrId=arguments[1];importFolderPathOrId=arguments[2];}
checkArgs([xml,xsdFilePathOrId],['xml','xsdFilePathOrId'],'validate');assertNode(xml,'xml');var schema=file.load(xsdFilePathOrId).getContents();var schemaDoc=this.Parser.fromString(schema);invoker(xmlApi,'nlapiValidateXML',[xml._gd(),schemaDoc._gd(),importFolderPathOrId!=null?importFolderPathOrId:null]);}
return Object.freeze({escape:escape,validate:validate,Parser:new Parser(),XPath:new XPath(),NodeType:NODE_TYPES_ENUM});});define('N/util/currencyUtility',['N/utilityFunctions'],function(utilityFunctions){var CURRENCY2_AND_RATE_PRECISION=8;function getDefaultCurrencyPrecision()
{return 2;}
function dollars_string(amount)
{var temp=amount;var DigitStrings=['zero','one','two','three','four','five','six','seven','eight','nine'];var TeenStrings=['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eightteen','nineteen'];var DecadeStrings=['zero','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];var result='';if(temp>=1000)
{result=result+dollars_string(Math.floor(temp/1000))+'thousand ';temp=temp%1000;}
if(temp>=100)
{result=result+DigitStrings[Math.floor(temp/100)]+' hundred ';temp=temp%100;}
if(temp>=20)
{result=result+DecadeStrings[Math.floor(temp/10)]+' ';temp=temp%10;}
if(temp>=10)
{result=result+TeenStrings[Math.floor(temp-10)]+' ';}
else if((amount==0)||(temp>0))
{result=result+DigitStrings[Math.floor(temp)]+' ';}
return result;}
function amount_string(amount)
{var cents=Math.floor((amount-Math.floor(amount))*100+0.5);var centstring=(cents<10)?'0'+cents.toString():cents.toString();var dollarstring=dollars_string(Math.floor(amount));return dollarstring.charAt(0).toUpperCase()+dollarstring.substr(1)+'and '+centstring+'/100';}
function format_rate(a,p,recordContext)
{var s;var cs;var n;var returnMe;if(isNaN(parseFloat(a)))
{returnMe='';}
else
{var precision=get_precision(recordContext);if(precision>1||p)
{s=(a<0);if(s)a=-a;var d=Math.floor(a);var c=Math.floor((a-d)*(p?10:100)+0.5);if(a==d+c/(p?10:100))
{if(c==(p?10:100))
{d++;c=0;}
cs=p?c.toString():((c<10)?'0'+c.toString():c.toString());returnMe=(s?'-':'')+d.toString()+'.'+cs+(p?'%':'');}
else
returnMe=(s?'-':'')+a+(p?'%':'');}
else if(precision===1)
{s=(a<0);if(s)a=-a;cs=a.toString();n=cs.indexOf('.');if(n==-1)cs=cs.toString()+'.0';else if(n==0)cs='0.'+cs.toString();else if(n==cs.length-1)cs=cs.toString()+'0';returnMe=(s?'-':'')+cs;}
else if(precision===0)
{s=(a<0);if(s)a=-a;cs=a.toString();n=cs.indexOf('.');if(n==0)cs='0.'+cs.toString();else if(n==cs.length-1)cs=cs.substring(0,cs.length-2);returnMe=(s?'-':'')+cs;}}
return returnMe;}
function getCurrencyPrecisionFieldValue(recordContext)
{var precision=2;if(!!recordContext)
{precision=recordContext.getFieldValue('currencyprecision');}
else if(typeof nlapiGetFieldValue==="function")
{precision=nlapiGetFieldValue('currencyprecision');}
return precision;}
function get_precision(recordContext)
{var cp=getCurrencyPrecisionFieldValue(recordContext);var precision=getDefaultCurrencyPrecision();if(cp!=null)
{var tprecision=parseFloat(cp.value);if(!isNaN(tprecision))
{precision=tprecision;}}
return precision;}
function round_currency(amount,numofdecimals,method,recordContext)
{var precision=numofdecimals;if(precision==null)
precision=get_precision(recordContext);var amountStr=amount+'';if(amount>1E10&&amountStr.indexOf('.')>=0&&(amountStr.length-amountStr.indexOf('.')-1<=precision))
return amount;var b=Math.abs(amount);b=Math.floor((b*100000.0)+0.5)/100000.0+0.000001;var factor=Math.pow(10,precision);if(!method||method=='OFF')b=Math.floor((b*factor)+0.5)/factor;else if(method=='UP')b=Math.round(Math.ceil(Math.abs(amount)*factor))/factor;else if(method=='DOWN')b=Math.round(Math.floor(Math.abs(amount)*factor))/factor;b=b*(amount>=0.0?1.0:-1.0);if(b===0.0)
return 0.0;return b;}
function round_float(a)
{return round_float_to_n_places(a,8);}
function round_float_to_n_places(a,n)
{var str=a+'';if(str.indexOf('.')<0)
return a;if(str.length-str.indexOf('.')-1<=n)
return a;var b=Math.abs(a);b=b+0.00000000000001;var factor=Math.pow(10,n);b=Math.floor((b*factor)+0.5)/factor;b=b*(a>=0.0?1.0:-1.0);if(b==0.0)
return 0.0;return b;}
function pad_to_atleast_two_decimal_places(a)
{var s;if(a==null)
{s='';}
else
{s=a.toString();var n=s.indexOf('.');if(n===-1)
{s=s+'.00';}
else if(n===s.length-1)
{s=s+'00';}
else if(n===s.length-2)
{s=s+'0';}
if(n===0)
{s='0'+s;}}
return s;}
function pad_decimal_places(a,noOfDecimalPlaces)
{var s;if(a==null)
{s='';}
else
{s=a.toString();var n=s.indexOf('.');if(noOfDecimalPlaces===0)
{if(a==0.0)
{s='0';}
else if(n>-1)
{s=s.substring(0,n);}}
else if(noOfDecimalPlaces===1)
{if(n==-1)
{s=s+'.0';}
else if(n==s.length-1)
{s=s+'0';}
else if(n==0)
{s='0'+s;}}
else
{if(n==-1)
{s=s+'.00';}
else if(n==s.length-1)
{s=s+'00';}
else if(n==s.length-2)
{s=s+'0';}
if(n==0)
{s='0'+s;}}}
return s;}
function format_currency(a,bDoNotRound,recordContext)
{if(isNaN(a))
return '';var cp=getCurrencyPrecisionFieldValue(recordContext);var noOfDecimalPlaces=getDefaultCurrencyPrecision();if(cp!==null)
{noOfDecimalPlaces=parseFloat(cp);if(isNaN(noOfDecimalPlaces))
{noOfDecimalPlaces=getDefaultCurrencyPrecision();}}
var returnMe;if(!(bDoNotRound==true))
{returnMe=round_currency(a,noOfDecimalPlaces);}
else
{returnMe=a;}
returnMe=pad_decimal_places(returnMe,noOfDecimalPlaces);return returnMe;}
function format_currency2(n,recordContext)
{if(isNaN(n))
{return '';}
var returnMe;if((n+'').indexOf('.')<0)
returnMe=n;else
returnMe=round_float_to_n_places(n,CURRENCY2_AND_RATE_PRECISION);var precision=get_precision(recordContext);if(precision===2){returnMe=pad_to_atleast_two_decimal_places(returnMe);}
return returnMe;}
function format_percent(p){if(typeof p=='string')
p=parseFloat(p);return p+(p===Math.floor(p)?'.0%':'%');}
function process_currency_field_value(value,fieldType,recordContext){if(!fieldType||fieldType.indexOf('currency')==-1)
return value;if(utilityFunctions.isValEmpty(value)||(''+value).indexOf('.')!=-1||isNaN(parseFloat(value)))
return value;var precision=fieldType.indexOf('currency2')>=0?2:get_precision(recordContext);return pad_decimal_places(''+value,precision);}
return Object.freeze({amount_string:amount_string,format_percent:format_percent,format_rate:format_rate,format_currency:format_currency,format_currency2:format_currency2,get_precision:get_precision,pad_decimal_places:pad_decimal_places,pad_to_atleast_two_decimal_places:pad_to_atleast_two_decimal_places,process_currency_field_value:process_currency_field_value,round_currency:round_currency,round_float:round_float,round_float_to_n_places:round_float_to_n_places});});define('N/util/date',['N/FieldValidationHelper'],function(FieldValidationHelper){var MONTHLENGTH=[[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]];var OLDEST_VALID_DATE=new Date(1601,3,1);var yearCharCN="Ã¥Â¹Â´";var monthCharCN="Ã¦Å“Ë†";var dayCharCN="Ã¦â€”Â¥";var TIME_FORMAT_WITH_POSSIBLE_AMPM_SUFFIX=/^(\d+)(\D)(\d+)((\D)(\d+))?\s*([aApP][mM])?/;var TIME_FORMAT_WITH_POSSIBLE_AMPM_PREFIX=/^([aApP][mM])(\d+)(\D)(\d+)(\D)((\d+)(\D))?/;var TIME_FORMAT_WITH_ASIAN_FORMATTING=/^(\d+)(\D)(\d+)(\D)((\d+)(\D))?/;var oracleDateTimeFormatter=new OracleDateTimeFormatter(FieldValidationHelper,{getJapaneseImperialEra:getJapaneseImperialEra,getShortJapaneseImperialEra:getShortJapaneseImperialEra,getJapaneseImperialYear:getJapaneseImperialYear});function getMonthIndexFromArray(array,val,ignorecase)
{for(var i=0;array!=null&&i<array.length;i++)
if(val==array[i]||(ignorecase&&val!=null&&array[i]!=null&&val.toLowerCase()==array[i].toLowerCase()))
return i;return-1;}
function getFullYear(d)
{if(typeof window!=='undefined'&&window.navigator!=null&&window.navigator.appName=="Netscape")
{if(!d.getFullYear)
return d.getYear();}
return d.getFullYear();}
var heiseiStartDate=new Date(1989,0,8);var showaStartDate=new Date(1926,11,25);var taishoStartDate=new Date(1912,6,30);var meijiStartDate=new Date(1868,8,8);function getJapaneseImperialEra(d)
{if(d>=heiseiStartDate)
return "Ã¥Â¹Â³Ã¦Ë†Â";else if(d>=showaStartDate)
return "Ã¦ËœÂ­Ã¥â€™Å’";else if(d>=taishoStartDate)
return "Ã¥Â¤Â§Ã¦Â­Â£";else
return "Ã¦ËœÅ½Ã¦Â²Â»";}
function getShortJapaneseImperialEra(d)
{if(d>=heiseiStartDate)
return "H";else if(d>=showaStartDate)
return "S";else if(d>=taishoStartDate)
return "D";else
return "M";}
function getJapaneseImperialYear(d)
{if(d>=heiseiStartDate)
return getFullYear(d)-1988;else if(d>=showaStartDate)
return getFullYear(d)-1925;else if(d>=taishoStartDate)
return getFullYear(d)-1911;else
return getFullYear(d)-1867;}
function getGregorianYear(japaneseImperialYear,era)
{if(era==="Ã¥Â¹Â³Ã¦Ë†Â"||era==="H")
return japaneseImperialYear+1988;else if(era==="Ã¦ËœÂ­Ã¥â€™Å’"||era==="S")
return japaneseImperialYear+1925;else if(era==="Ã¥Â¤Â§Ã¦Â­Â£"||era==="D")
return japaneseImperialYear+1911;else
return japaneseImperialYear+1867;}
function getMonthIndex(sMonth)
{var m=-1;sMonth=sMonth.toUpperCase()
for(var i=0;i<FieldValidationHelper.datetime_short_months.length;i++)
{if(FieldValidationHelper.datetime_short_months[i].toUpperCase()===sMonth)
{m=i+1;break;}}
if(m!==-1)
return m;for(var i=0;i<FieldValidationHelper.datetime_months.length;i++)
{if(FieldValidationHelper.datetime_months.toUpperCase()===sMonth)
{m=i+1;break;}}
return m;}
function setFullYear(d,val)
{if(typeof window!=='undefined'&&window.navigator!==null&&window.navigator.appName==="Netscape")
{if(!d.setFullYear)
d.setYear(val);}
d.setFullYear(val);}
function isLeapYear(year)
{return(year%4===0)&&((year%100!==0)||(year%400===0));}
function getMonthLength(year,month)
{return MONTHLENGTH[isLeapYear(year)?1:0][month];}
function addMonths(d,mtoadd)
{if(mtoadd!=0)
{var year=getFullYear(d);var dom=d.getDate();var month=d.getMonth()+mtoadd;if(month<0)
{month+=1;year=year+Math.ceil(month/12)-1;setFullYear(d,year);month=11+(month%12);}
else if(month>11)
{year=year+Math.floor(month/12);setFullYear(d,year);month%=12;if(dom===29)
d.setDate(dom);}
var eom=getMonthLength(year,month);if(dom>eom)
d.setDate(eom);d.setMonth(month);}
return d;}
function addDays(d,daystoadd)
{if(!(d instanceof Date||Object.prototype.toString.call(d)==='[object Date]'))
return d;var d2=new Date(d.getTime()+86400*daystoadd*1000);if(d2.getHours()!==d.getHours())
{if((d.getHours()>0&&d2.getHours()<d.getHours())||(d.getHours()===0&&d2.getHours()===23))
d2.setTime(d2.getTime()+3600*1000);else
d2.setTime(d2.getTime()-3600*1000);}
d.setTime(d2.getTime());return d;}
function isValidYearMonthDay(year,month,day)
{return!(isNaN(year)||year<0||isNaN(month)||month<0||month>11||isNaN(day)||day<1||day>getMonthLength(year,month));}
function trimString(str)
{str=""+str;return str.replace(/^\s+/,"").replace(/\s+$/,"");}
function hhmmToTimeString(hhmm)
{var AM=FieldValidationHelper.datetime_am_string||"";var PM=FieldValidationHelper.datetime_pm_string||"";var fldvalue=hhmm;var hour,minute;if(AM.charAt(0)===PM.charAt(0))
re=new RegExp("^[0-9]{1,4}("+AM+"|"+PM+")*$","i");else
re=new RegExp("^[0-9]{1,4}(["+AM.charAt(0)+"|"+PM.charAt(0)+"]?)$","i");if(re.test(fldvalue))
{var aorp='';if(RegExp.$1)
{if(AM.charAt(0)===PM.charAt(0))
aorp=RegExp.$1.toLowerCase()===PM?PM:AM;else
aorp=RegExp.$1.toLowerCase().charAt(0)===PM.charAt(0)?PM:AM;}
if(fldvalue.length<3||(fldvalue.length===3&&RegExp.$1))
{var hh=RegExp.$1?fldvalue.substring(0,fldvalue.length-1):fldvalue;hour=parseInt(hh,10)==0?12:(parseInt(hh,10)>12?parseInt(hh,10)%12:hh);minute=0;var ampm=RegExp.$1?aorp:(parseInt(fldvalue,10)>11?PM:AM);}
else if(fldvalue.length===3||(fldvalue.length===4&&RegExp.$1))
{var hh=fldvalue.substring(0,1)==="0"?"12":fldvalue.substring(0,1);hour=parseInt(hh,10);var mm=RegExp.$1?fldvalue.substring(1,3):fldvalue.substring(1);minute=parseInt(mm,10);var ampm=RegExp.$1?aorp:AM;}
else
{var hh=fldvalue.substring(0,2);hour=parseInt(hh,10)===0?12:(parseInt(hh,10)>12?parseInt(hh,10)%12:hh);var mm=RegExp.$1?fldvalue.substring(2,4):fldvalue.substring(2);minute=parseInt(mm,10);var ampm=parseInt(fldvalue.substring(0,2),10)>11?PM:AM;ampm=RegExp.$1?aorp:ampm;}
if(ampm===AM&&hour===12)
hour=0;else if(ampm===PM&&hour!==12)
hour=parseInt(hour)+12;var time=new Date();time.setHours(hour,minute,0,0);fldvalue=getTimeString(time,AM,PM);}
return fldvalue;}
function regexStringToTime(date,time,includeSeconds,returnNullIfInvalid)
{time=time!=null?trimString(time):time;var timeformat=FieldValidationHelper.timeformat||"fmHH:fmMI am";var timeformatWithSeconds=FieldValidationHelper.timeformatwithseconds||"fmHH:fmMI:SS am";var flddate=date!=null?stringToDate(date,"",returnNullIfInvalid):new Date();if(flddate==null)
return null;if(time!=null&&String(time).length!=0&&String(time).search(/\S/)>=0)
{var hours=NaN;var minutes=NaN;var seconds=NaN;var delimitors;time=trimString(time);var TIME_FORMAT_MAP={"HH:MI:SS am":{rcase:0,hend:':',mend:':',send:' '},"HH-MI-SS am":{rcase:0,hend:'-',mend:'-',send:' '},"HH24:MI:SS":{rcase:0,hend:':',mend:':',send:null},"HH24-MI-SS":{rcase:0,hend:'-',mend:'-',send:null},"amHHÃ¦â„¢â€šMIÃ¥Ë†â€ SSÃ§Â§â€™":{rcase:1,hend:'Ã¦â„¢â€š',mend:'Ã¥Ë†â€ ',send:'Ã§Â§â€™'},"amHHÃ§â€šÂ¹MIÃ¥Ë†â€ SSÃ§Â§â€™":{rcase:1,hend:'Ã§â€šÂ¹',mend:'Ã¥Ë†â€ ',send:'Ã§Â§â€™'},"amHHÃ¬â€¹Å“MIÃ«Â¶â€žSSÃ¬Â´Ë†":{rcase:1,hend:'Ã¬â€¹Å“',mend:'Ã«Â¶â€ž',send:'Ã¬Â´Ë†'},"HH24Ã¦â„¢â€šMIÃ¥Ë†â€ SSÃ§Â§â€™":{rcase:2,hend:'Ã¦â„¢â€š',mend:'Ã¥Ë†â€ ',send:'Ã§Â§â€™'},"HH24Ã§â€šÂ¹MIÃ¥Ë†â€ SSÃ§Â§â€™":{rcase:2,hend:'Ã§â€šÂ¹',mend:'Ã¥Ë†â€ ',send:'Ã§Â§â€™'},"HH24Ã¬â€¹Å“MIÃ«Â¶â€žSSÃ¬Â´Ë†":{rcase:2,hend:'Ã¬â€¹Å“',mend:'Ã«Â¶â€ž',send:'Ã¬Â´Ë†'},"HH:MI am":{rcase:0,hend:':',mend:' ',send:null},"HH-MI am":{rcase:0,hend:'-',mend:' ',send:null},"HH24:MI":{rcase:0,hend:':',mend:null,send:null},"HH24-MI":{rcase:0,hend:'-',mend:null,send:null},"amHHÃ¦â„¢â€šMIÃ¥Ë†â€ ":{rcase:1,hend:'Ã¦â„¢â€š',mend:'Ã¥Ë†â€ ',send:null},"amHHÃ§â€šÂ¹MIÃ¥Ë†â€ ":{rcase:1,hend:'Ã§â€šÂ¹',mend:'Ã¥Ë†â€ ',send:null},"amHHÃ¬â€¹Å“MIÃ«Â¶â€ž":{rcase:1,hend:'Ã¬â€¹Å“',mend:'Ã«Â¶â€ž',send:null},"HH24Ã¦â„¢â€šMIÃ¥Ë†â€ ":{rcase:2,hend:'Ã¦â„¢â€š',mend:'Ã¥Ë†â€ ',send:null},"HH24Ã§â€šÂ¹MIÃ¥Ë†â€ ":{rcase:2,hend:'Ã§â€šÂ¹',mend:'Ã¥Ë†â€ ',send:null},"HH24Ã¬â€¹Å“MIÃ«Â¶â€ž":{rcase:2,hend:'Ã¬â€¹Å“',mend:'Ã«Â¶â€ž',send:null}};var format=oracleDateTimeFormatter.preprocessDateTimeFormat(includeSeconds?timeformatWithSeconds:timeformat);delimitors=TIME_FORMAT_MAP[format];var m;var ampm=null;var hend=null;var mend=null;var send=null;if(delimitors!=null)
{switch(delimitors.rcase)
{case 0:{m=TIME_FORMAT_WITH_POSSIBLE_AMPM_SUFFIX.exec(time);if(m!==null)
{hours=parseInt(m[1],10);hend=m[2];minutes=parseInt(m[3],10);mend=m[5];if(includeSeconds&&m[4]!=null)
seconds=parseInt(m[6],10);else
seconds=0;ampm=m[7];}
break;}
case 1:{var amtime=time.replace(/Ã¥ÂË†Ã¥â€°Â|Ã¤Â¸Å Ã¥ÂË†|Ã¬ËœÂ¤Ã¬ â€ž/g,'am');amtime=amtime.replace(/Ã¥ÂË†Ã¥Â¾Å’|Ã¤Â¸â€¹Ã¥ÂË†|Ã¬ËœÂ¤Ã­â€ºâ€ž/g,'pm');m=TIME_FORMAT_WITH_POSSIBLE_AMPM_PREFIX.exec(amtime);if(m!==null)
{hours=parseInt(m[2],10);hend=m[3];minutes=parseInt(m[4],10);mend=m[5];if(includeSeconds&&m[6]!=null)
{seconds=parseInt(m[7],10);send=m[8];}
else
seconds=0;ampm=m[1];}
break;}
case 2:{m=TIME_FORMAT_WITH_ASIAN_FORMATTING.exec(time);if(m!==null)
{hours=parseInt(m[1],10);hend=m[2];minutes=parseInt(m[3],10);mend=m[4];if(includeSeconds&&m[5]!=null)
{seconds=parseInt(m[6],10);send=m[7];}
else
seconds=0;}
break;}}
if(isNaN(hours)||isNaN(minutes)||isNaN(seconds)||hours>=24||hours<0||minutes>=60||minutes<0||seconds>=60||seconds<0)
return NaN;if(hend!=delimitors.hend||(includeSeconds&&(mend!=null&&mend!=delimitors.mend)||(send!=null&&send!=delimitors.send)))
return NaN;if(ampm!=null)
{hours=getHoursIn24HourFormat((ampm.toLowerCase()==FieldValidationHelper.datetime_pm_string),hours);}
flddate.setHours(hours,minutes,seconds,0);}else
flddate=NaN;}
return flddate;}
function stringToMMYYDate(arg,dateformat,returnNullIfInvalid)
{if(!dateformat)
{if(typeof(window.dateformat)!=="undefined")
dateformat=window.dateformat;else
dateformat="MM/DD/YYYY";}
var returnValIfError=returnNullIfInvalid?null:new Date();dateformat=oracleDateTimeFormatter.preprocessDateTimeFormat(dateformat);var parts,mm,yy;var yearCharIndex,monthCharIndex,dayCharIndex,era;var comps=arg.split(/[\.\/-]/);if(!/^[0-9\-\/\.]+$/.test(arg))
{if(comps.length!==2)
return returnValIfError;else
{mm=getMonthIndex(comps[0])-1;yy=parseInt(comps[1],10);}}
else
{if(comps.length===1)
{if((arg.length===4)||(arg.length===6))
{mm=parseInt(arg.slice(0,2),10)-1;yy=parseInt(arg.slice(2),10)}}
else if(comps.length===2)
{mm=parseInt(comps[0],10)-1;yy=parseInt(comps[1],10);}}
if(yy<50)
yy+=2000;else if(yy<100)
yy+=1900;if(!isValidYearMonthDay(yy,mm,1))
return returnValIfError;else
return new Date(yy,mm);}
function splitDateAndTime(dateTime)
{var spaceCount=0;var dateformat=oracleDateTimeFormatter.preprocessDateTimeFormat(FieldValidationHelper.dateformat||"MM/DD/YYYY");dateTime=trimString(dateTime);switch(dateformat)
{case "MM/DD/YYYY":case "DD/MM/YYYY":case "DD.MM.YYYY":case "DD-Mon-YYYY":case "DD-MONTH-YYYY":case "YYYY/MM/DD":case "YYYY-MM-DD":case "EEYYÃ¥Â¹Â´MMÃ¦Å“Ë†DDÃ¦â€”Â¥":case "YYYYÃ¥Â¹Â´MMÃ¦Å“Ë†DDÃ¦â€”Â¥":case "EYY.MM.DD":spaceCount=0;break;case "DD. MON YYYY":case "YYYYÃ«â€¦â€ž MMÃ¬â€ºâ€ DDÃ¬ÂÂ¼":case "DD MONTH, YYYY":case "DD MONTH YYYY":spaceCount=2;break;case "DD de MONTH de YYYY":spaceCount=4;break;default:return{date:dateTime,time:null};}
var myRegex=(spaceCount===0)?new RegExp("^(\\S+)\\s+(.*)$"):new RegExp("^(\\S+(\\s+\\S+){"+spaceCount+"})\\s+(.*)$");var matches=dateTime.match(myRegex);if(matches)
{return{date:matches[1],time:(spaceCount===0)?matches[2]:matches[3]}}
else
{return{date:dateTime,time:null};}}
function stringToDate(d,dateformat,returnNullIfInvalid,formattype)
{d=trimString(d);var comps;var month,day,year;var yearCharIndex,monthCharIndex,dayCharIndex,era;if(!dateformat)
{dateformat=FieldValidationHelper.dateformat||"MM/DD/YYYY";}
var dateStrLength=d.length;var endStr;var yearLength=4;var returnValIfError=returnNullIfInvalid?null:new Date();dateformat=oracleDateTimeFormatter.preprocessDateTimeFormat(dateformat);if(d.length>0)
{switch(dateformat)
{case "MM/DD/YYYY":comps=d.split("/");if(comps.length<3)
return returnValIfError;month=parseInt(comps[0],10)-1;day=parseInt(comps[1],10);year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD/MM/YYYY":comps=d.split("/");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=parseInt(comps[1],10)-1;year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD.MM.YYYY":comps=d.split(".");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=parseInt(comps[1],10)-1;year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD-Mon-YYYY":comps=d.split("-");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=getMonthIndex(comps[1])-1;year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD-MONTH-YYYY":comps=d.split("-");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=getMonthIndexFromArray(FieldValidationHelper.datetime_months,comps[1],true);year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "YYYY/MM/DD":comps=d.split("/");if(comps.length<3)
return returnValIfError;endStr=comps[2].split(" ")[0];day=parseInt(endStr,10);month=parseInt(comps[1],10)-1;year=parseInt(comps[0],10);dateStrLength=comps[1].length+endStr.length+yearLength+2;break;case "YYYY-MM-DD":comps=d.split("-");if(comps.length<3)
return returnValIfError;endStr=comps[2].split(" ")[0];day=parseInt(endStr,10);month=parseInt(comps[1],10)-1;year=parseInt(comps[0],10);dateStrLength=comps[1].length+endStr.length+yearLength+2;break;case "EEYYÃ¥Â¹Â´MMÃ¦Å“Ë†DDÃ¦â€”Â¥":yearCharIndex=d.indexOf(yearCharCN);monthCharIndex=d.indexOf(monthCharCN);dayCharIndex=d.indexOf(dayCharCN);if(yearCharIndex<0||monthCharIndex<0||dayCharIndex<0)
return returnValIfError;day=parseInt(d.substring(monthCharIndex+1,dayCharIndex),10);month=parseInt(d.substring(yearCharIndex+1,monthCharIndex),10)-1;era=d.substring(0,2);year=getGregorianYear(parseInt(d.substring(2,yearCharIndex),10),era);dateStrLength=dayCharIndex+1;break;case "YYYYÃ¥Â¹Â´MMÃ¦Å“Ë†DDÃ¦â€”Â¥":yearCharIndex=d.indexOf(yearCharCN);monthCharIndex=d.indexOf(monthCharCN);dayCharIndex=d.indexOf(dayCharCN);if(yearCharIndex<0||monthCharIndex<0||dayCharIndex<0)
return returnValIfError;day=parseInt(d.substring(monthCharIndex+1,dayCharIndex),10);month=parseInt(d.substring(yearCharIndex+1,monthCharIndex),10)-1;year=parseInt(d.substring(0,yearCharIndex),10);dateStrLength=dayCharIndex+1;break;case "EYY.MM.DD":comps=d.split(".");if(comps.length<3)
return returnValIfError;endStr=comps[2].split(" ")[0];day=parseInt(endStr,10);month=parseInt(comps[1],10)-1;era=comps[0].substring(0,1);year=getGregorianYear(parseInt(comps[0].substring(1,comps[0].length),10),era);dateStrLength=comps[0].length+comps[1].length+endStr.length+2;break;case "DD. MON YYYY":comps=d.split(" ");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0].substring(0,comps[0].length-1),10);month=getMonthIndexFromArray(FieldValidationHelper.datetime_short_months,comps[1]);year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD de MONTH de YYYY":comps=d.split(" de ");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=getMonthIndex(comps[1])-1;year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+8;break;case "YYYYÃ«â€¦â€ž MMÃ¬â€ºâ€ DDÃ¬ÂÂ¼":comps=d.split(" ");if(comps.length<3)
return returnValIfError;day=parseInt(comps[2].substring(0,comps[2].length-1),10);month=parseInt(comps[1].substring(0,comps[1].length-1),10)-1;year=parseInt(comps[0].substring(0,comps[0].length-1),10);dateStrLength=yearLength+comps[1].length+comps[2].length+5;break;case "DD MONTH YYYY":comps=d.split(" ");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=getMonthIndexFromArray(FieldValidationHelper.datetime_months,comps[1],true);year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;case "DD MONTH, YYYY":comps=d.split(" ");if(comps.length<3)
return returnValIfError;day=parseInt(comps[0],10);month=getMonthIndexFromArray(FieldValidationHelper.datetime_months,comps[1].substring(0,comps[1].length-1),true);year=parseInt(comps[2].substring(0,yearLength),10);dateStrLength=comps[0].length+comps[1].length+yearLength+2;break;}}
if(!isValidYearMonthDay(year,month,day))
return returnValIfError;var result;var t=d.substring(dateStrLength);if(t!=null&&t.length>0)
{if(formattype=='datetimetz')
result=regexStringToTime(d.substring(0,dateStrLength),t,true,returnNullIfInvalid);else if(formattype=='datetime'||formattype=='timeofday')
result=regexStringToTime(d.substring(0,dateStrLength),t,false,returnNullIfInvalid);else
result=stringToTime(d.substring(0,dateStrLength),t);}
else
result=new Date(year,month,day);if(result!=null&&!isNaN(result)){if(year<50)
setFullYear(result,year+2000);else if(year<100)
setFullYear(result,year+1900);}
return isNaN(result)&&returnNullIfInvalid?null:result;}
function getHoursIn24HourFormat(isPM,hours)
{if(!isPM&&hours==12)
return 0;else if(isPM&&hours<12)
return hours+12;else
return hours;}
function stringToTime(date,time)
{time=time!=null?trimString(time):time;var timeformat=oracleDateTimeFormatter.preprocessDateTimeFormat(FieldValidationHelper.timeformat||"fmHH:fmMI am");var AM=FieldValidationHelper.datetime_am_string||"";var PM=FieldValidationHelper.datetime_pm_string||"";var flddate=date!==null?stringToDate(date):new Date();if(time!==null&&String(time).length!=0&&String(time).search(/\S/)>=0)
{var hours;var minutes;var isPM;var hourCharIndex;var format=timeformat.replace(/fm/g,"").replace(/"/g,"");if(format==="HH:MI am"||format==="HH-MI am"||format==="HH24:MI"||format==="HH24-MI")
{var m=/^\s*(\d+)[-:](\d+)\s*(.*)/.exec(time);if(!m)return NaN;hours=parseInt(m[1],10);minutes=parseInt(m[2],10);if(format.substring(6)==="am")
{isPM=(m[3].toLowerCase()===PM);hours=getHoursIn24HourFormat(isPM,hours);}}
else if(format==="amHHÃ¦â„¢â€šMIÃ¥Ë†â€ "||format==="amHHÃ§â€šÂ¹MIÃ¥Ë†â€ "||format==="amHHÃ¬â€¹Å“MIÃ«Â¶â€ž")
{hourCharIndex=time.indexOf("Ã¦â„¢â€š");if(hourCharIndex<0)
hourCharIndex=time.indexOf("Ã§â€šÂ¹");if(hourCharIndex<0)
hourCharIndex=time.indexOf("Ã¬â€¹Å“");var hour_start_index=0;isPM=false;if(time.indexOf(AM)==0)
hour_start_index=AM.length;else if(time.indexOf(PM)==0)
{hour_start_index=PM.length;isPM=true;}
hours=parseInt(time.substring(hour_start_index,hourCharIndex),10);hours=getHoursIn24HourFormat(isPM,hours);minutes=parseInt(time.substring(hourCharIndex+1,time.length-1),10);}
else if(format==="HH24Ã¦â„¢â€šMIÃ¥Ë†â€ "||format==="HH24Ã§â€šÂ¹MIÃ¥Ë†â€ "||format==="HH24Ã¬â€¹Å“MIÃ«Â¶â€ž")
{hourCharIndex=time.indexOf("Ã¦â„¢â€š");if(hourCharIndex<0)
hourCharIndex=time.indexOf("Ã§â€šÂ¹");if(hourCharIndex<0)
hourCharIndex=time.indexOf("Ã¬â€¹Å“");hours=parseInt(time.substring(0,hourCharIndex),10);minutes=parseInt(time.substring(hourCharIndex+1,time.length-1),10);}
if(isNaN(hours)||isNaN(minutes)||hours>=24||hours<0||minutes>=60||minutes<0)
return NaN;flddate.setHours(hours,minutes,0,0);}
return flddate;}
function getTimeString(time,amvar,pmvar)
{if(!(time instanceof Date||Object.prototype.toString.call(time)==='[object Date]'))
return time;var timeformat=FieldValidationHelper.timeformat||"fmHH:fmMI am";return oracleDateTimeFormatter.formatDateTime(time,timeformat);}
function getDateString(d,format)
{var dateformat;if(format)
dateformat=format;else
{dateformat=FieldValidationHelper.dateformat||"MM/DD/YYYY";}
return oracleDateTimeFormatter.formatDateTime(d,dateformat);}
function getTimeWithSecondsString(time,amvar,pmvar)
{if(!(time instanceof Date||Object.prototype.toString.call(time)==='[object Date]'))
return time;var timeformatWithSeconds=FieldValidationHelper.timeformatwithseconds||"fmHH:fmMI:SS am";return oracleDateTimeFormatter.formatDateTime(time,timeformatWithSeconds);}
function getMMYYString(date)
{var dateformat=FieldValidationHelper.dateformat||"fmMM/DDfm/YYYY";return oracleDateTimeFormatter.formatMMYYDateString(date,dateformat);}
function getDatetimeString(date)
{return getDateString(date)+" "+getTimeString(date);}
function getDatetimetzString(date)
{return getDateString(date)+" "+getTimeWithSecondsString(date);}
var m_j_d=[[0,31,59,90,120,151,181,212,243,273,304,334],[0,31,60,91,121,152,182,213,244,274,305,335]];var j_d=[];j_d[1970]=0;j_d[1971]=365;j_d[1972]=730;j_d[1973]=1096;j_d[1974]=1461;j_d[1975]=1826;j_d[1976]=2191;j_d[1977]=2557;j_d[1978]=2922;j_d[1979]=3287;j_d[1980]=3652;j_d[1981]=4018;j_d[1982]=4383;j_d[1983]=4748;j_d[1984]=5113;j_d[1985]=5479;j_d[1986]=5844;j_d[1987]=6209;j_d[1988]=6574;j_d[1989]=6940;j_d[1990]=7305;j_d[1991]=7670;j_d[1992]=8035;j_d[1993]=8401;j_d[1994]=8766;j_d[1995]=9131;j_d[1996]=9496;j_d[1997]=9862;j_d[1998]=10227;j_d[1999]=10592;j_d[2000]=10957;j_d[2001]=11323;j_d[2002]=11688;j_d[2003]=12053;j_d[2004]=12418;j_d[2005]=12784;j_d[2006]=13149;j_d[2007]=13514;j_d[2008]=13879;j_d[2009]=14245;j_d[2010]=14610;j_d[2011]=14975;j_d[2012]=15340;j_d[2013]=15706;j_d[2014]=16071;j_d[2015]=16436;j_d[2016]=16801;j_d[2017]=17167;j_d[2018]=17532;j_d[2019]=17897;j_d[2020]=18262;j_d[2021]=18628;j_d[2022]=18993;j_d[2023]=19358;j_d[2024]=19723;j_d[2025]=20089;j_d[2026]=20454;j_d[2027]=20819;j_d[2028]=21184;j_d[2029]=21550;j_d[2030]=21915;function getMonthJulian(year,month)
{return m_j_d[isLeapYear(year)?1:0][month];}
function get_julian_date(d)
{return j_d[d.getFullYear()]+getMonthJulian(d.getFullYear(),d.getMonth())+d.getDate()-1;}
function isDateTooOld(timeString)
{return timeString<OLDEST_VALID_DATE;}
function getOldestDateString()
{return getDateString(OLDEST_VALID_DATE);}
function _hhmm_to_mins(time){return time.hrs*60+time.mins;}
function round_hhmm_nearest(hrs,mins,round_by){var up_time=round_hhmm_up(hrs,mins,round_by);var down_time=round_hhmm_down(hrs,mins,round_by);orig_mins=_hhmm_to_mins({hrs:hrs,mins:mins});up_mins=_hhmm_to_mins(up_time);down_mins=_hhmm_to_mins(down_time);if(up_mins-orig_mins>orig_mins-down_mins){return down_time;}else{return up_time;}}
function round_hhmm_up(hrs,mins,round_by){mins+=(mins%round_by>0?(round_by-(mins%round_by)):0);if(mins>=60){var _hhmm_delta=Math.floor(mins/60);mins-=(_hhmm_delta*60);hrs+=_hhmm_delta;}
return{hrs:hrs,mins:mins};}
function round_hhmm_down(hrs,mins,round_by){mins-=(mins>0?(mins%round_by):0);return{hrs:hrs,mins:mins};}
function round_hhmm(val,round_by,direction){if(val=="")return val;var re=/^([0-9]+?):([0-9]+)$/;var result=re.exec(val);if(result==null){result=format_hhmm(val);if(result==null)return val;}
var hrs=parseFloat(result[1]);var mins=parseFloat(result[2]);var time;if(direction=='UP'){time=round_hhmm_up(hrs,mins,round_by);}else if(direction=='DOWN'){time=round_hhmm_down(hrs,mins,round_by);}else if(direction=='NEAR'){time=round_hhmm_nearest(hrs,mins,round_by);}else{throw direction+' is not vald direction: [UP,DOWN,NEAREST]';}
if(time.mins<10)time.mins='0'+time.mins;return time.hrs+':'+time.mins;}
function format_hhmm(val){var hours;var minutes;var re=/([0-9][0-9]?)?(:[0-9][0-9]+)?/
var result=re.exec(val)
if(result==null||result.index>0||result[0].length!=val.length){timeval=parseFloat(val);if(isNaN(timeval))hours=-1;else{hours=Math.floor(timeval);minutes=Math.floor((timeval-hours)*60+0.5);}}else{if(RegExp.$1.length>0)hours=parseInt(RegExp.$1,10);else hours=0;if(typeof(RegExp.$2)!="undefined"&&RegExp.$2.length>0){minutes=parseInt(RegExp.$2.substr(1),10);if(minutes>=60){var hours_delta=Math.floor(minutes/60);minutes-=(hours_delta*60);hours+=hours_delta;}}else minutes=0;}
if(hours>=0&&minutes>=0&&minutes<60){return[val,hours,minutes];}}
function parse_time(val){if(val==null||val.trim().length==0)
return null;var time={hours:0,minutes:0,negative:false};var rexp=/^(\-?)(\d*)(:(\d+))?$/;var rexpRes=rexp.exec(val);if(rexpRes==null){var timeval=parseFloat(val);if(isNaN(timeval)){return null;}else{if(timeval<0){timeval=Math.abs(timeval);time.negative=true;}
time.hours=Math.floor(timeval);time.minutes=Math.round((timeval-time.hours)*60);}}else{if(typeof rexpRes[2]!="undefined"&&rexpRes[2].trim().length>0){time.hours=parseInt(rexpRes[2],10);}
if(typeof rexpRes[4]!="undefined"&&rexpRes[4].trim().length>0){time.minutes=parseInt(rexpRes[4],10);if(time.minutes>=60){var delta=Math.floor(time.minutes/60);time.hours+=delta;time.minutes-=delta*60;}}
if(rexpRes[1]=='-'&&(time.hours>0||time.minutes>0))
time.negative=true;}
return time;}
function round_hhmm2(val,round_by,direction){var result=parse_time(val);if(result==null){return val;}
var hrs=result.hours;var mins=result.minutes;var time;if(direction=='UP'){time=round_hhmm_up(hrs,mins,round_by);}else if(direction=='DOWN'){time=round_hhmm_down(hrs,mins,round_by);}else if(direction=='NEAR'){time=round_hhmm_nearest(hrs,mins,round_by);}else{throw direction+' is not vald direction: [UP,DOWN,NEAREST]';}
if(time.mins<10)time.mins='0'+time.mins;return(result.negative?'-':'')+time.hrs+':'+time.mins;}
function OracleDateTimeFormatter(settingsContainer,japaneseEraHandlers,shortMonthsMap,longMonthsMap){var that=this;this.settingsContainer=settingsContainer;this.shortMonthsMap=shortMonthsMap===undefined?settingsContainer.datetime_short_months:shortMonthsMap;this.longMonthsMap=longMonthsMap===undefined?settingsContainer.datetime_months:longMonthsMap;this.getJapaneseImperialEra=japaneseEraHandlers.getJapaneseImperialEra;this.getShortJapaneseImperialEra=japaneseEraHandlers.getShortJapaneseImperialEra;this.getJapaneseImperialYear=japaneseEraHandlers.getJapaneseImperialYear;function DateTimeElementType(matchPattern,formatterFunction){this.matchRegexp=new RegExp('^'+matchPattern,'i');this.formatterFunction=formatterFunction;}
function DateTimeElement(elementType,value,isUnpadded,isStrict){this.elementType=elementType;this.value=value;this.isUnpadded=isUnpadded;this.isStrict=isStrict;this.formatterFunction=elementType.formatterFunction;}
this.padChar=function padChar(value,length,characterToPad){while(value.length<length){value=characterToPad+value;}
return value;};this.padZeros=function padZeros(value,length){return that.padChar(value,length,'0');};this.padSpace=function padSpace(value,length){return that.padChar(value,length,' ');};this.formatDateTimeElement=function formatDateTimeElement(element,valueFromDateObject,maxWidth){var width=element.value.length;if(maxWidth!==undefined&&width>maxWidth){width=maxWidth;}
var isUnpadded=element.isUnpadded;var padFunc=isNaN(valueFromDateObject)?that.padSpace:that.padZeros;var valueAsString=valueFromDateObject.toString();return isUnpadded?valueAsString:padFunc(valueAsString,width);};this.formatters=Object.freeze({formatMeridian:function formatMeridian(dateTimeElement,dateObject){var amvar=that.settingsContainer.datetime_am_string||'';var pmvar=that.settingsContainer.datetime_pm_string||'';var hours=dateObject.getHours();return hours<12?amvar:pmvar;},formatDayOfMonth:function formatDayOfMonth(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getDate())},formatDayOfWeek:function formatDayOfWeek(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getDay());},formatLongEra:function formatLongEra(dateTimeElement,dateObject){return that.getJapaneseImperialEra(dateObject);},formatShortEra:function formatShortEra(dateTimeElement,dateObject){return that.getShortJapaneseImperialEra(dateObject);},format24Hour:function format24Hour(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getHours(),2);},format12Hour:function format12Hour(dateTimeElement,dateObject){var valueIn12Hour=dateObject.getHours()%12;if(valueIn12Hour===0)valueIn12Hour=12;return that.formatDateTimeElement(dateTimeElement,valueIn12Hour,2);},formatISOYear:function formatISOYear(dateTimeElement,dateObject){return this.formatYear(dateTimeElement,dateObject);},formatMonth:function formatMonth(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getMonth()+1);},formatMinute:function formatMinute(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getMinutes());},formatLongMonthName:function formatLongMonthName(dateTimeElement,dateObject){return that.longMonthsMap[dateObject.getMonth()];},formatShortMonthName:function formatShortMonthName(dateTimeElement,dateObject){return that.shortMonthsMap[dateObject.getMonth()];},formatSeconds:function formatSeconds(dateTimeElement,dateObject){return that.formatDateTimeElement(dateTimeElement,dateObject.getSeconds());},formatYear:function formatYear(dateTimeElement,dateObject){var yearValue=that.getFullYear(dateObject);return that.formatDateTimeElement(dateTimeElement,yearValue);},formatLastDigitOfYear:function formatLastDigitOfYear(dateTimeElement,dateObject){var yearAsString=that.getFullYear(dateObject).toString();return yearAsString.substr(-dateTimeElement.value.length);},formatText:function formatText(dateTimeElement,dateObject){return dateTimeElement.value.replace(/"/g,"");},formatAsIs:function formatAsIs(dateTimeElement,dateObject){return dateTimeElement.value;}});this.getFullYear=function getFullYearDefaultImpl(dateObject){return dateObject.getFullYear();};this.dateTimeElementTypes=Object.freeze({AD_INDICATOR:new DateTimeElementType('A\.D\.|AD'),MERIDIAN:new DateTimeElementType('[AP]\.M\.|[AP]M',that.formatters.formatMeridian),ERA_INDICATOR:new DateTimeElementType('B\.C\.|BC'),CENTURY:new DateTimeElementType('S?CC'),DAY_NAME:new DateTimeElementType('DAY'),ABBREV_DAY_NAME:new DateTimeElementType('DY'),DAY_OF_YEAR:new DateTimeElementType('DDD'),DAY_OF_MONTH:new DateTimeElementType('DD',that.formatters.formatDayOfMonth),SHORT_DATE:new DateTimeElementType('DS'),LONG_DATE:new DateTimeElementType('DL'),DAY_OF_WEEK:new DateTimeElementType('D',that.formatters.formatDayOfWeek),FULL_ERA:new DateTimeElementType('EE',that.formatters.formatLongEra),ABBREV_ERA:new DateTimeElementType('E',that.formatters.formatShortEra),FRACTIONAL_SECONDS:new DateTimeElementType('FF[1-9]'),HOUR_OF_DAY_24:new DateTimeElementType('HH24',that.formatters.format24Hour),HOUR_OF_DAY_12:new DateTimeElementType('HH(12)?',that.formatters.format12Hour),ISO_WEEK_OF_YEAR:new DateTimeElementType('IW'),ISO_YEAR:new DateTimeElementType('IY{0,3}',that.formatters.formatISOYear),JULIAN_DAY:new DateTimeElementType('J'),MINUTE:new DateTimeElementType('MI',that.formatters.formatMinute),MONTH:new DateTimeElementType('MM',that.formatters.formatMonth),LONG_MONTH_NAME:new DateTimeElementType('Month',that.formatters.formatLongMonthName),SHORT_MONTH_NAME:new DateTimeElementType('Mon',that.formatters.formatShortMonthName),QUARTER_OF_YEAR:new DateTimeElementType('Q'),ROMAN_NUMERAL_MONTH:new DateTimeElementType('RM'),LONG_ROUNDED_YEAR:new DateTimeElementType('RRRR'),SHORT_ROUNDED_YEAR:new DateTimeElementType('RR'),SECONDS_PAST_MIDNIGHT:new DateTimeElementType('SSSSS'),SECONDS:new DateTimeElementType('SS',that.formatters.formatSeconds),SHORT_TIME:new DateTimeElementType('TS'),TZ_DAYLIGHT_SAVING:new DateTimeElementType('TZD'),TZ_HOUR:new DateTimeElementType('TZH'),TZ_MINUTE:new DateTimeElementType('TZM'),TZ_REGION:new DateTimeElementType('TZR'),WEEK_OF_YEAR:new DateTimeElementType('WW'),WEEK_OF_MONTH:new DateTimeElementType('W'),LOCAL_RADIX:new DateTimeElementType('X'),FOUR_DIGIT_YEAR:new DateTimeElementType('S?YYYY',that.formatters.formatYear),SPELLED_OUT_YEAR:new DateTimeElementType('S?YEAR'),LAST_DIGIT_OF_YEAR:new DateTimeElementType('Y{1,3}',that.formatters.formatLastDigitOfYear),TEXT:new DateTimeElementType('"[^"]*"',that.formatters.formatText),PUNCTUATION:new DateTimeElementType('[-/,.;:]+',that.formatters.formatAsIs),WHITESPACE:new DateTimeElementType('\\s+',that.formatters.formatAsIs),UNPAD_MOD:new DateTimeElementType('fm'),STRICT_MOD:new DateTimeElementType('fx'),SINGLE_QUOTE:new DateTimeElementType('\'\'',that.formatters.formatAsIs)});this.matchOrder=[this.dateTimeElementTypes.AD_INDICATOR,this.dateTimeElementTypes.MERIDIAN,this.dateTimeElementTypes.ERA_INDICATOR,this.dateTimeElementTypes.CENTURY,this.dateTimeElementTypes.DAY_NAME,this.dateTimeElementTypes.ABBREV_DAY_NAME,this.dateTimeElementTypes.DAY_OF_YEAR,this.dateTimeElementTypes.DAY_OF_MONTH,this.dateTimeElementTypes.SHORT_DATE,this.dateTimeElementTypes.LONG_DATE,this.dateTimeElementTypes.DAY_OF_WEEK,this.dateTimeElementTypes.FULL_ERA,this.dateTimeElementTypes.ABBREV_ERA,this.dateTimeElementTypes.FRACTIONAL_SECONDS,this.dateTimeElementTypes.HOUR_OF_DAY_24,this.dateTimeElementTypes.HOUR_OF_DAY_12,this.dateTimeElementTypes.ISO_WEEK_OF_YEAR,this.dateTimeElementTypes.ISO_YEAR,this.dateTimeElementTypes.JULIAN_DAY,this.dateTimeElementTypes.MINUTE,this.dateTimeElementTypes.MONTH,this.dateTimeElementTypes.LONG_MONTH_NAME,this.dateTimeElementTypes.SHORT_MONTH_NAME,this.dateTimeElementTypes.QUARTER_OF_YEAR,this.dateTimeElementTypes.ROMAN_NUMERAL_MONTH,this.dateTimeElementTypes.LONG_ROUNDED_YEAR,this.dateTimeElementTypes.SHORT_ROUNDED_YEAR,this.dateTimeElementTypes.SECONDS_PAST_MIDNIGHT,this.dateTimeElementTypes.SECONDS,this.dateTimeElementTypes.SHORT_TIME,this.dateTimeElementTypes.TZ_DAYLIGHT_SAVING,this.dateTimeElementTypes.TZ_HOUR,this.dateTimeElementTypes.TZ_MINUTE,this.dateTimeElementTypes.TZ_REGION,this.dateTimeElementTypes.WEEK_OF_YEAR,this.dateTimeElementTypes.WEEK_OF_MONTH,this.dateTimeElementTypes.LOCAL_RADIX,this.dateTimeElementTypes.FOUR_DIGIT_YEAR,this.dateTimeElementTypes.SPELLED_OUT_YEAR,this.dateTimeElementTypes.LAST_DIGIT_OF_YEAR,this.dateTimeElementTypes.TEXT,this.dateTimeElementTypes.PUNCTUATION,this.dateTimeElementTypes.WHITESPACE,this.dateTimeElementTypes.UNPAD_MOD,this.dateTimeElementTypes.STRICT_MOD,this.dateTimeElementTypes.SINGLE_QUOTE];this.numericalMonthTypes=[this.dateTimeElementTypes.MONTH];this.textualMonthTypes=[this.dateTimeElementTypes.SHORT_MONTH_NAME,this.dateTimeElementTypes.LONG_MONTH_NAME];this.yearTypes=[this.dateTimeElementTypes.ISO_YEAR,this.dateTimeElementTypes.LAST_DIGIT_OF_YEAR,this.dateTimeElementTypes.FOUR_DIGIT_YEAR];this.separatorTypes=[this.dateTimeElementTypes.PUNCTUATION,this.dateTimeElementTypes.WHITESPACE,this.dateTimeElementTypes.TEXT];this.parseDateTimeFormat=function parseDateTimeFormat(formatSpecifier){if(formatSpecifier===undefined){formatSpecifier=this.settingsContainer.dateformat;}
var elements=[];var isUnpadded=false;var isStrict=false;var index=0;var specifierLength=formatSpecifier.length;while(index<specifierLength){var remainder=formatSpecifier.substring(index,specifierLength);var matchResult=null;if(matchResult=this.matchDateTimeElement(this.dateTimeElementTypes.UNPAD_MOD,remainder)){isUnpadded=!isUnpadded;}else if(matchResult=this.matchDateTimeElement(this.dateTimeElementTypes.STRICT_MOD,remainder)){isStrict=!isStrict;}else{for(var i=0;i<this.matchOrder.length;i++){var dateTimeElementType=this.matchOrder[i];matchResult=this.matchDateTimeElement(dateTimeElementType,remainder);if(matchResult!==null){elements.push(new DateTimeElement(dateTimeElementType,matchResult,isUnpadded,isStrict));break;}}}
if(matchResult===null){throw "Failed to parse format specifier '"+formatSpecifier+"': Unrecognized element at position "+index;}
index+=matchResult.length;}
return elements;};this.matchDateTimeElement=function matchDateTimeElement(dateTimeElementType,inputString){var matchResult=dateTimeElementType.matchRegexp.exec(inputString);if(matchResult===null||matchResult.index!==0)return null;return matchResult[0];};this.formatDateTime=function formatDateTime(date,formatSpecifier){var elements=this.parseDateTimeFormat(formatSpecifier);var containsEra=elements.some(function(element){return(element.elementType===that.dateTimeElementTypes.FULL_ERA||element.elementType===that.dateTimeElementTypes.ABBREV_ERA);});if(containsEra){this.getFullYear=this.getJapaneseImperialYear}
return this.formatDateTimeFromElements(elements,date);};this.formatDateTimeFromElements=function formatDateTimeFromElements(elements,dateObject){return elements.map(function(element){var formatterFunction=element.formatterFunction;if(formatterFunction===undefined){throw "No formatting function associated with element type "+element.elementType.toString();}
return formatterFunction(element,dateObject);}).join('');};this.formatMMYYDateString=function formatMMYYDateString(dateObject,dateFormat){var elements=this.extractMMYYElements(this.parseDateTimeFormat(dateFormat));return this.formatDateTimeFromElements(elements,dateObject);};this.extractMMYYElements=function extractMMYYElements(dateFormatElements){var elementsLength=dateFormatElements.length;var index=0;var monthElement=null,yearElement=null,separator=null;while(index<elementsLength&&(monthElement===null||yearElement===null||separator===null)){var currentElement=dateFormatElements[index];var currentType=currentElement.elementType;var currentValue=currentElement.value;var currentIsUnpadded=currentElement.isUnpadded;var currentIsStrict=currentElement.isStrict;var nextElementType=index+1!==elementsLength?dateFormatElements[index+1].elementType:undefined;if(monthElement===null&&this.numericalMonthTypes.indexOf(currentType)!==-1){monthElement=currentElement;}else if(monthElement===null&&this.textualMonthTypes.indexOf(currentType)!==-1){monthElement=new DateTimeElement(this.dateTimeElementTypes.SHORT_MONTH_NAME,'Mon',currentIsUnpadded,currentIsStrict);}else if(yearElement===null&&this.yearTypes.indexOf(currentType)!==-1){yearElement=currentElement;}else if(separator===null&&this.separatorTypes.indexOf(currentType)!==-1){if(currentValue==='-'||(currentValue==='.'&&nextElementType!==this.dateTimeElementTypes.WHITESPACE)){separator=currentElement;}else{separator=new DateTimeElement(this.dateTimeElementTypes.PUNCTUATION,'/',currentIsUnpadded,currentIsStrict);}}
index++;}
return[monthElement,separator,yearElement].filter(function(value){return value!==null});};this.preprocessDateTimeFormat=function preprocessDateTimeFormat(inputFormat){return inputFormat.replace(/f[mx]|"/ig,"");}}
return Object.freeze({addMonths:addMonths,addDays:addDays,hhmmToTimeString:hhmmToTimeString,regexStringToTime:regexStringToTime,stringToTime:stringToTime,splitDateAndTime:splitDateAndTime,stringToDate:stringToDate,stringToMMYYDate:stringToMMYYDate,getTimeWithSecondsString:getTimeWithSecondsString,getTimeString:getTimeString,getDateString:getDateString,getMMYYString:getMMYYString,getDatetimeString:getDatetimeString,getDatetimetzString:getDatetimetzString,get_julian_date:get_julian_date,isDateTooOld:isDateTooOld,getOldestDateString:getOldestDateString,round_hhmm:round_hhmm,round_hhmm2:round_hhmm2});});define('N/restricted/dateTimeZoneApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/dateTimeZone',['N/restricted/dateTimeZoneApi','N/restricted/invoker','N/utilityFunctions','N/error'],function(dateTimeZoneApi,invoker,utilityFunctions,error)
{var TIME_ZONES=Object.freeze({ETC_GMT_PLUS_12:'Etc/GMT+12',PACIFIC_SAMOA:'Pacific/Samoa',PACIFIC_HONOLULU:'Pacific/Honolulu',AMERICA_ANCHORAGE:'America/Anchorage',AMERICA_LOS_ANGELES:'America/Los_Angeles',AMERICA_TIJUANA:'America/Tijuana',AMERICA_DENVER:'America/Denver',AMERICA_PHOENIX:'America/Phoenix',AMERICA_CHIHUAHUA:'America/Chihuahua',AMERICA_CHICAGO:'America/Chicago',AMERICA_REGINA:'America/Regina',AMERICA_GUATEMALA:'America/Guatemala',AMERICA_MEXICO_CITY:'America/Mexico_City',AMERICA_NEW_YORK:'America/New_York',US_EAST_INDIANA:'US/East-Indiana',AMERICA_BOGOTA:'America/Bogota',AMERICA_CARACAS:'America/Caracas',AMERICA_HALIFAX:'America/Halifax',AMERICA_LA_PAZ:'America/La_Paz',AMERICA_MANAUS:'America/Manaus',AMERICA_SANTIAGO:'America/Santiago',AMERICA_ST_JOHNS:'America/St_Johns',AMERICA_SAO_PAULO:'America/Sao_Paulo',AMERICA_BUENOS_AIRES:'America/Buenos_Aires',ETC_GMT_PLUS_3:'Etc/GMT+3',AMERICA_GODTHAB:'America/Godthab',AMERICA_MONTEVIDEO:'America/Montevideo',AMERICA_NORONHA:'America/Noronha',ETC_GMT_PLUS_1:'Etc/GMT+1',ATLANTIC_AZORES:'Atlantic/Azores',EUROPE_LONDON:'Europe/London',GMT:'GMT',ATLANTIC_REYKJAVIK:'Atlantic/Reykjavik',EUROPE_WARSAW:'Europe/Warsaw',EUROPE_PARIS:'Europe/Paris',ETC_GMT_MINUS_1:'Etc/GMT-1',EUROPE_AMSTERDAM:'Europe/Amsterdam',EUROPE_BUDAPEST:'Europe/Budapest',AFRICA_CAIRO:'Africa/Cairo',EUROPE_ISTANBUL:'Europe/Istanbul',ASIA_JERUSALEM:'Asia/Jerusalem',ASIA_AMMAN:'Asia/Amman',ASIA_BEIRUT:'Asia/Beirut',AFRICA_JOHANNESBURG:'Africa/Johannesburg',EUROPE_KIEV:'Europe/Kiev',EUROPE_MINSK:'Europe/Minsk',AFRICA_WINDHOEK:'Africa/Windhoek',ASIA_RIYADH:'Asia/Riyadh',EUROPE_MOSCOW:'Europe/Moscow',ASIA_BAGHDAD:'Asia/Baghdad',AFRICA_NAIROBI:'Africa/Nairobi',ASIA_TEHRAN:'Asia/Tehran',ASIA_MUSCAT:'Asia/Muscat',ASIA_BAKU:'Asia/Baku',ASIA_YEREVAN:'Asia/Yerevan',ETC_GMT_MINUS_3:'Etc/GMT-3',ASIA_KABUL:'Asia/Kabul',ASIA_KARACHI:'Asia/Karachi',ASIA_YEKATERINBURG:'Asia/Yekaterinburg',ASIA_TASHKENT:'Asia/Tashkent',ASIA_CALCUTTA:'Asia/Calcutta',ASIA_KATMANDU:'Asia/Katmandu',ASIA_ALMATY:'Asia/Almaty',ASIA_DHAKA:'Asia/Dhaka',ASIA_RANGOON:'Asia/Rangoon',ASIA_BANGKOK:'Asia/Bangkok',ASIA_KRASNOYARSK:'Asia/Krasnoyarsk',ASIA_HONG_KONG:'Asia/Hong_Kong',ASIA_KUALA_LUMPUR:'Asia/Kuala_Lumpur',ASIA_TAIPEI:'Asia/Taipei',AUSTRALIA_PERTH:'Australia/Perth',ASIA_IRKUTSK:'Asia/Irkutsk',ASIA_MANILA:'Asia/Manila',ASIA_SEOUL:'Asia/Seoul',ASIA_TOKYO:'Asia/Tokyo',ASIA_YAKUTSK:'Asia/Yakutsk',AUSTRALIA_DARWIN:'Australia/Darwin',AUSTRALIA_ADELAIDE:'Australia/Adelaide',AUSTRALIA_SYDNEY:'Australia/Sydney',AUSTRALIA_BRISBANE:'Australia/Brisbane',AUSTRALIA_HOBART:'Australia/Hobart',PACIFIC_GUAM:'Pacific/Guam',ASIA_VLADIVOSTOK:'Asia/Vladivostok',ASIA_MAGADAN:'Asia/Magadan',PACIFIC_KWAJALEIN:'Pacific/Kwajalein',PACIFIC_AUCKLAND:'Pacific/Auckland',PACIFIC_TONGATAPU:'Pacific/Tongatapu'});function checkValidTimezone(timezone)
{var valid=(timezone==null||util.isNumber(timezone));if(!valid&&util.isString(timezone))
{Object.getOwnPropertyNames(TIME_ZONES).forEach(function(key){valid|=timezone===TIME_ZONES[key];});if(!valid)utilityFunctions.throwSuiteScriptError(error.Type.SSS_UNEXPECTED_VALUE_1_FOR_2,timezone,'format.Timezone');}
return valid;}
function getTimeZone(timezone)
{if(timezone===null||timezone===undefined)
{return null;}
return isNaN(timezone)?timezone:parseInt(timezone,10);}
function parse(strict,value,timezone)
{if(strict){utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(value,'value',util.isString),utilityFunctions.checkArgObject(timezone,'timezone',checkValidTimezone)]);}
timezone=getTimeZone(timezone);try{var timeObject=invoker(dateTimeZoneApi,'parseWithTimeZone',[value,timezone]);var date=new Date(timeObject.timeSinceEpochInMS);if(timeObject.isDST===false&&isDST(date)){date.setTime(date.getTime()+getDSTOffsetInMS(date))}
else if(timeObject.isDST===true&&!isDST(date)){date.setTime(date.getTime()-getDSTOffsetInMS(date))}
return date;}
catch(e)
{if(strict)
throw(e);return value;}}
function format(strict,value,timezone)
{if(strict)
{utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(value,'value',util.isDate),utilityFunctions.checkArgObject(timezone,'timezone',checkValidTimezone)]);}
if(!util.isDate(value))
return value;timezone=getTimeZone(timezone);try{return invoker(dateTimeZoneApi,'formatWithTimeZone',[value.getTime(),timezone,isDST(value)]);}
catch(e){if(strict)
throw(e);return value;}}
function isDST(theDate){return getDSTOffsetInMS(theDate)!==0;}
function getDSTOffsetInMS(theDate){var jan=new Date(theDate.getFullYear(),0,1);var jul=new Date(theDate.getFullYear(),6,1);return(theDate.getTimezoneOffset()-Math.max(jan.getTimezoneOffset(),jul.getTimezoneOffset()))*60000;}
return Object.freeze({parse:parse.bind(this,false),format:format.bind(this,false),parseStrict:parse.bind(this,true),formatStrict:format.bind(this,true),Timezone:TIME_ZONES});});define('N/fieldTypeConstants',[],function()
{var FIELD_TYPES=Object.freeze({DATE:"date",TIME:"time",TIMETRACK:"timetrack",TIMEOFDAY:"timeofday",DATETIME:"datetime",DATETIMETZ:"datetimetz",INTEGER:"integer",POSINTEGER:"posinteger",PERCENT:"percent",RATE:"rate",RATEHIGHPRECISION:"ratehighprecision",FLOAT:"float",POSFLOAT:"posfloat",NONNEGFLOAT:"nonnegfloat",POSCURRENCY:"poscurrency",NONNEGCURRENCY:"nonnegcurrency",CURRENCY:"currency",CURRENCY2:"currency2",EMAIL:"email",EMAILS:"emails",URL:"url",CHECKBOX:"checkbox",CCNUMBER:"ccnumber",RADIO:"radio",PHONE:"phone",FULLPHONE:"fullphone",IDENTIFIER:"identifier",IDENTIFIERANYCASE:"identifieranycase",FUNCTION:"function",QUOTEDFUNCTION:"'function'",MMYYDATE:"mmyydate",CCEXPDATE:"ccexpdate",CCVALIDFROM:"ccvalidfrom",COLOR:"color",PACKAGE:"package",FURIGANA:"furigana",ADDRESS:"address",TEXT:"text"});function isNumeric(fieldType)
{return(fieldType===FIELD_TYPES.INTEGER)||(fieldType===FIELD_TYPES.POSINTEGER)||(fieldType===FIELD_TYPES.FLOAT)||(fieldType===FIELD_TYPES.POSFLOAT)||(fieldType===FIELD_TYPES.NONNEGFLOAT)||(fieldType===FIELD_TYPES.PERCENT)||(fieldType===FIELD_TYPES.RATE)||(fieldType===FIELD_TYPES.RATEHIGHPRECISION);}
function isCurrency(fieldType)
{return(fieldType===FIELD_TYPES.POSCURRENCY)||(fieldType===FIELD_TYPES.CURRENCY)||(fieldType===FIELD_TYPES.CURRENCY2)||(fieldType===FIELD_TYPES.NONNEGCURRENCY);}
return Object.freeze({Type:FIELD_TYPES,isNumeric:isNumeric,isCurrency:isCurrency});});define('N/util/formatter',['N/util/currencyUtility','N/util/date','N/FieldValidationHelper','N/dateTimeZone','N/error','N/utilityFunctions','N/fieldTypeConstants'],function(CurrencyUtil,DateUtil,FieldValidationHelper,dateTimeZone,error,utilityFunctions,fieldTypeConstants){function formatNumber(num,addPercentSign)
{if(isNaN(num)||utilityFunctions.isValEmpty(num))
return num;var str=''+num;var parts=str.split(".");var integerPart=parts[0];var decimalPart=parts.length>1?FieldValidationHelper.decimalseparator+parts[1]:'';if(FieldValidationHelper.groupseparator!=='')
{var regex=/(\d+)(\d{3})/;while(regex.test(integerPart))
{integerPart=integerPart.replace(regex,'$1'+FieldValidationHelper.groupseparator+'$2');}}
if(num<0&&FieldValidationHelper.negativeprefix!=='-')
{return FieldValidationHelper.negativeprefix+integerPart.replace('-','')+decimalPart
+(!!addPercentSign?"%":"")+FieldValidationHelper.negativesuffix;}
else
{return integerPart+decimalPart+(!!addPercentSign?"%":"");}}
function formatPhoneNumber(phoneStr)
{if(utilityFunctions.isValEmpty(phoneStr))
return phoneStr;var phoneFormatPref=FieldValidationHelper.phoneformat;var returnMe=""+phoneStr;if(phoneFormatPref===null||typeof phoneFormatPref==="undefined"||/[A-Za-z]/.test(returnMe))
return returnMe;var valueStripped=phoneStr.replace(/[\s\.\-\(\)]/g,"");if(/^[0-9]+$/.test(valueStripped))
{var ETX_CHAR=String.fromCharCode(3);var phoneformat=phoneFormatPref.replace(new RegExp("[360]","g"),ETX_CHAR);if(valueStripped.length===7)
returnMe=phoneformat.replace(phoneformat.substring(0,phoneformat.indexOf('4')),'').replace('45'+ETX_CHAR,valueStripped.substring(0,3)).replace('789'+ETX_CHAR,valueStripped.substring(3));else if(valueStripped.length===10)
returnMe=phoneformat.replace('12'+ETX_CHAR,valueStripped.substring(0,3)).replace('45'+ETX_CHAR,valueStripped.substring(3,6)).replace('789'+ETX_CHAR,valueStripped.substring(6));else if(valueStripped.length===11&&valueStripped.substring(0,1)==='1')
returnMe='1 '+phoneformat.replace('12'+ETX_CHAR,valueStripped.substring(1,4)).replace('45'+ETX_CHAR,valueStripped.substring(4,7)).replace('789'+ETX_CHAR,valueStripped.substring(7));}
return returnMe;}
function formatDate(dateObj)
{if(dateObj instanceof Date||Object.prototype.toString.call(dateObj)==='[object Date]')
{dateObj=new Date(dateObj);return DateUtil.getDateString(dateObj);}
else
return dateObj;}
function formatTime(timeObj)
{if(timeObj instanceof Date||Object.prototype.toString.call(timeObj)==='[object Date]')
{timeObj=new Date(timeObj);return DateUtil.getTimeString(timeObj);}
else
return timeObj;}
function formatDateTimeTz(dateTimeObj)
{if(dateTimeObj instanceof Date||Object.prototype.toString.call(dateTimeObj)==='[object Date]')
return dateTimeZone.format(dateTimeObj);else
return dateTimeObj;}
function formatMMYYDate(dateObj)
{if(dateObj instanceof Date||Object.prototype.toString.call(dateObj)==='[object Date]')
return DateUtil.getMMYYString(dateObj);else
return dateObj;}
function formatToHHMM(numHrs)
{if(isNaN(numHrs)||utilityFunctions.isValEmpty(numHrs))
return numHrs;var isNeg=false;if(numHrs<0)
{isNeg=true;numHrs*=-1}
var hrs=Math.floor(numHrs);var mins=Math.floor((numHrs-hrs)*60+0.5);var sign=isNeg?"-":"";return sign+hrs+":"+(mins<10?"0":"")+mins;}
function formatCurrency(num,isCurrency2)
{if(utilityFunctions.isValEmpty(num))
return num;var formattedCurrency=isCurrency2?CurrencyUtil.format_currency2(num):CurrencyUtil.format_currency(num);return(formattedCurrency==='')?num:formatNumber(formattedCurrency,false);}
function formatRate(rateNum,includePercentSign)
{if(isNaN(rateNum)||utilityFunctions.isValEmpty(rateNum))
return rateNum;var returnMe=CurrencyUtil.format_rate(rateNum,includePercentSign).replace("%","");return(returnMe==='')?rateNum:formatNumber(returnMe,includePercentSign);}
function formatPercent(percentNum)
{if(isNaN(percentNum)||utilityFunctions.isValEmpty(percentNum))
return percentNum;var returnMe=CurrencyUtil.format_percent(percentNum).replace("%","");return formatNumber(returnMe,true);}
function formatCheckbox(checkboxValue)
{return(typeof checkboxValue==='boolean'&&checkboxValue)||checkboxValue==='T'?'T':'F';}
function format(value,type,isNum,isCurr,includePercentSign)
{var returnMe;var isNumeric=isNum||fieldTypeConstants.isNumeric(type);var isCurrency=isCurr||fieldTypeConstants.isCurrency(type);if(utilityFunctions.isValEmpty(value))
return value;if(type===fieldTypeConstants.Type.DATE)
{return formatDate(value);}
else if(type===fieldTypeConstants.Type.TIMEOFDAY)
{return formatTime(value);}
else if((type===fieldTypeConstants.Type.DATETIME)||(type===fieldTypeConstants.Type.DATETIMETZ))
{return formatDateTimeTz(value);}
else if(type===fieldTypeConstants.Type.MMYYDATE)
{return formatMMYYDate(value);}
else if((type===fieldTypeConstants.Type.TIME)||(type===fieldTypeConstants.Type.TIMETRACK))
{return formatToHHMM(value);}
else if((type===fieldTypeConstants.Type.RATE)||(type===fieldTypeConstants.Type.RATEHIGHPRECISION))
{return formatRate(value,includePercentSign);}
else if(type===fieldTypeConstants.Type.PERCENT)
{return formatPercent(value);}
else if(type===fieldTypeConstants.Type.CHECKBOX)
{return formatCheckbox(value);}
else if(!!isNumeric)
{return formatNumber(value,false);}
else if(!!isCurrency)
{return formatCurrency(value,type===fieldTypeConstants.Type.CURRENCY2)}
else if((type===fieldTypeConstants.Type.PHONE)||(type===fieldTypeConstants.Type.FULLPHONE))
{return formatPhoneNumber(value);}
return value;}
function groupSeparatorPositionsValid(str)
{if(FieldValidationHelper.negativeprefix!=='-'&&str.indexOf(FieldValidationHelper.negativeprefix)===0)
str='-'+str.replace(FieldValidationHelper.negativeprefix,'').replace(FieldValidationHelper.negativesuffix,'');if(str.length<3)
return false;var lastDecimal=util.isString(FieldValidationHelper.decimalseparator)?str.lastIndexOf(FieldValidationHelper.decimalseparator):-1;if(lastDecimal>=0)
str=str.substr(0,lastDecimal);var parts=str.split(FieldValidationHelper.groupseparator);if(parts.length>1)
{for(var i=1;i<parts.length;i++)
{if(parts[i].length!=3)
return false;}}
return true;}
function formatUserPrefStringToJSNumber(str,autoplace)
{str=""+str;if(utilityFunctions.isValEmpty(str))
return "";if(FieldValidationHelper.groupseparator&&FieldValidationHelper.groupseparator!==''&&groupSeparatorPositionsValid(str))
str=str.replace(new RegExp('\\'+FieldValidationHelper.groupseparator,'g'),'');if(FieldValidationHelper.negativeprefix!=='-'&&str.indexOf(FieldValidationHelper.negativeprefix)===0)
str='-'+str.replace(FieldValidationHelper.negativeprefix,'').replace(FieldValidationHelper.negativesuffix,'');if(FieldValidationHelper.decimalseparator===',')
str=str.replace(FieldValidationHelper.decimalseparator,'.');if(isNaN(str))
return str;else if(autoplace&&(str.indexOf(".")===-1))
return parseFloat(str)/100;else
return parseFloat(str);}
function convertTimeStringToHours(timeStr)
{var isPositive=true;var convertedStr=""+timeStr;if(convertedStr.slice(0,1)==="-")
{isPositive=false;convertedStr=convertedStr.slice(1);}
var pattern=/([0-9]*)?:([0-9]+)?/;var result=pattern.exec(convertedStr);if(result===null)
{if(isNaN(convertedStr))
{return timeStr;}
else
{return(isPositive?1:-1)*parseFloat(convertedStr);}}
else
{var hours;var minutes;if(RegExp.$1.length>0)
{hours=parseInt(RegExp.$1,10);}
else
{hours=0;}
if(typeof(RegExp.$2)!=="undefined"&&RegExp.$2.length>0)
{minutes=parseInt(RegExp.$2,10);}
return(isNaN(hours)||isNaN(minutes))?timeStr:(isPositive?1:-1)*(hours+minutes/60);}}
function evaluateMath(equation)
{if(utilityFunctions.isValEmpty(equation)||!isNaN(equation))
return equation;var calcMe=equation;if(equation.charAt(0)==='=')
calcMe=equation.substr(1);if(!!FieldValidationHelper.groupseparator&&!!FieldValidationHelper.decimalseparator)
calcMe=calcMe.replace(new RegExp('\\'+FieldValidationHelper.groupseparator,'g'),'').replace(new RegExp('\\'+FieldValidationHelper.decimalseparator,'g'),'.');if(isNaN(calcMe)&&calcMe.match(/[\+\-\*\/0-9\.\(\)\s]+/))
{try
{calcMe=eval.apply(utilityFunctions.getGlobalScope(),[calcMe]);}
catch(e)
{calcMe=equation;}}
else
{calcMe=equation;}
return calcMe;}
function formatShorthandedTime(timeStr)
{timeStr=util.trim(timeStr);if(utilityFunctions.isValEmpty(timeStr))
return "";var lastSpaceIdx=timeStr.lastIndexOf(" ");if(lastSpaceIdx>0)
{return timeStr.slice(0,lastSpaceIdx+1)+DateUtil.hhmmToTimeString(timeStr.slice(lastSpaceIdx+1))}
else
{return DateUtil.hhmmToTimeString(timeStr);}}
function addHTTPIfNecessary(urlString)
{if(urlString.indexOf("://")===-1)
urlString="http://"+urlString;return urlString;}
function stripPhoneSeparators(phoneStr)
{var phoneFormat=FieldValidationHelper.phoneformat;if(typeof phoneFormat==="undefined")
return phoneStr;phoneStr=util.trim(phoneStr);var formatHasParens=(phoneFormat.indexOf("(")===0);var formatDelimiter=phoneFormat.slice(-5,-4);var hasNoAreaCode=(phoneStr.length===8);if(formatDelimiter===".")
formatDelimiter="\\.";var formatRegex=new RegExp("^("+(formatHasParens?"\\(":"")+"(\\d{3})"+(formatHasParens?"\\)\\ ":formatDelimiter)+")?"
+"(\\d{3})"+formatDelimiter
+"(\\d{4})$");var matchResult=phoneStr.match(formatRegex);if(matchResult===null)
{return phoneStr;}
else
{return(matchResult[2]?matchResult[2]:"")+matchResult[3]+matchResult[4];}}
function parseCCDateStr(ccStr)
{var parts=ccStr.split("/");var returnStr="";if(parts.length===2)
{if(isNaN(parts[0])||isNaN(parts[1]))
return ccStr;var monthPart=parseInt(parts[0],10)
var yearPart=parseInt(parts[1],10)
if(isNaN(monthPart)||isNaN(yearPart)||monthPart<=0||yearPart<0)
return ccStr;if(monthPart<10)
returnStr="0"+monthPart+"/";else
returnStr=monthPart+"/";if(yearPart<50)
returnStr+=2000+yearPart;else if(yearPart<100)
returnStr+=1900+yearPart;else
returnStr+=yearPart;return returnStr;}
else
return ccStr;}
function convertToUserPreferenceTZDate(dateTimeObj)
{return dateTimeZone.parse(dateTimeObj);}
function parse(value,type,isNum,isCurr,validationType,autoplace)
{var returnMe;var isNumeric=isNum||fieldTypeConstants.isNumeric(type);var isCurrency=isCurr||fieldTypeConstants.isCurrency(type);if(utilityFunctions.isValEmpty(value))
return value;if((type!==fieldTypeConstants.Type.TEXT)&&(type!==fieldTypeConstants.Type.IDENTIFIER)&&(type!==fieldTypeConstants.Type.IDENTIFIERANYCASE)&&(type!==fieldTypeConstants.Type.ADDRESS)&&(/[\uff01-\uff5e]/.exec(value)!==null))
value=value.replace(/[\uff01-\uff5e]/g,function(ch){return String.fromCharCode(ch.charCodeAt(0)-0xfee0);});if(type===fieldTypeConstants.Type.DATE)
{returnMe=DateUtil.regexStringToTime(value,null,false,true);return(isNaN(returnMe)||(returnMe===null))?value:returnMe;}
else if(type===fieldTypeConstants.Type.TIMEOFDAY)
{returnMe=DateUtil.regexStringToTime(null,formatShorthandedTime(value),false,true);return(isNaN(returnMe)||(returnMe===null))?value:returnMe;}
else if((type===fieldTypeConstants.Type.DATETIME)||(type===fieldTypeConstants.Type.DATETIMETZ))
{returnMe=convertToUserPreferenceTZDate(value);return(isNaN(returnMe)||(returnMe===null))?value:returnMe;}
else if(type===fieldTypeConstants.Type.MMYYDATE)
{returnMe=DateUtil.stringToMMYYDate(value,FieldValidationHelper.dateformat,true);return(isNaN(returnMe)||(returnMe===null))?value:returnMe;}
else if((type===fieldTypeConstants.Type.TIME)||(type===fieldTypeConstants.Type.TIMETRACK))
{return convertTimeStringToHours(value);}
else if(!!isNumeric||!!isCurrency)
{var strValue=""+value;if((type===fieldTypeConstants.Type.PERCENT)||(type===fieldTypeConstants.Type.RATE)||(type===fieldTypeConstants.Type.RATEHIGHPRECISION))
{if(strValue.slice(-1)==="%")
strValue=strValue.slice(0,-1);}
var evalValue=strValue;var evalPerformed=false;if(!!isCurrency&&(strValue.substr(1).search(/[\+\-\*\/]/g)!==-1))
{evalValue=evaluateMath(strValue);if(evalValue!==strValue)
evalPerformed=true;}
var performAutoPlace=(autoplace&&(!!isCurrency||(type===fieldTypeConstants.Type.RATE)||(type===fieldTypeConstants.Type.RATEHIGHPRECISION)))
returnMe=evalPerformed?evalValue:formatUserPrefStringToJSNumber(evalValue,performAutoPlace);return isNaN(returnMe)?value:returnMe;}
else if((type===fieldTypeConstants.Type.URL))
{return addHTTPIfNecessary(value);}
else if((type===fieldTypeConstants.Type.PHONE)||(type===fieldTypeConstants.Type.FULLPHONE))
{return stripPhoneSeparators(value);}
else if(type===fieldTypeConstants.Type.CHECKBOX)
{return value==='T';}
else if(type===fieldTypeConstants.Type.IDENTIFIER)
{return value.toLowerCase();}
else if(type===fieldTypeConstants.Type.CCNUMBER)
{return(""+value).replace(/ /g,"").replace(/\-/g,"");}
else if((type===fieldTypeConstants.Type.CCEXPDATE)||(type===fieldTypeConstants.Type.CCVALIDFROM))
{return parseCCDateStr(value);}
else if(type===fieldTypeConstants.Type.COLOR)
{return(((value.charAt(0)!=="#")&&(value.length===6))?"#":"")+value;}
else if((type===fieldTypeConstants.Type.FUNCTION)||((validationType!==null)&&(typeof validationType!=="undefined")&&(validationType.toLowerCase()===fieldTypeConstants.Type.QUOTEDFUNCTION)))
{if(value.indexOf('(')>0)
return value.substr(0,value.indexOf('('));}
return value;}
function formatValueAsString(value,fieldType)
{if(util.isArray(value))
return value.join(String.fromCharCode(5));else if(value==null)
return value;else if(!fieldType)
return String(value);else
return String(format(value,fieldType))}
return Object.freeze({format:format,evaluateMath:evaluateMath,formatValueAsString:formatValueAsString,parse:parse,convertTimeStringToHours:convertTimeStringToHours});});define('N/format',['N/util/formatter','N/utilityFunctions','N/dateTimeZone','N/fieldTypeConstants'],function(formatter,utilityFunctions,dateTimeZone,fieldTypeConstants)
{function doParse(options,type)
{var value,timezone=null,undef=undefined;if(type!==undef)
{value=options;}
else if(options!==undef&&options!==null)
{value=options.value;type=options.type;timezone=options.timezone||null;}
utilityFunctions.checkArgs([value,type],['value','type'],'parse');switch(type)
{case fieldTypeConstants.Type.DATE:case fieldTypeConstants.Type.TIME:case fieldTypeConstants.Type.TIMETRACK:case fieldTypeConstants.Type.TIMEOFDAY:case fieldTypeConstants.Type.URL:case fieldTypeConstants.Type.CHECKBOX:case fieldTypeConstants.Type.CCNUMBER:case fieldTypeConstants.Type.PHONE:case fieldTypeConstants.Type.FULLPHONE:case fieldTypeConstants.Type.IDENTIFIER:case fieldTypeConstants.Type.MMYYDATE:case fieldTypeConstants.Type.CCEXPDATE:case fieldTypeConstants.Type.CCVALIDFROM:case fieldTypeConstants.Type.COLOR:case fieldTypeConstants.Type.FUNCTION:return formatter.parse(value,type);case fieldTypeConstants.Type.INTEGER:case fieldTypeConstants.Type.POSINTEGER:case fieldTypeConstants.Type.PERCENT:case fieldTypeConstants.Type.FLOAT:case fieldTypeConstants.Type.POSFLOAT:case fieldTypeConstants.Type.NONNEGFLOAT:case fieldTypeConstants.Type.RATE:case fieldTypeConstants.Type.RATEHIGHPRECISION:return formatter.parse(value,type,true);case fieldTypeConstants.Type.POSCURRENCY:case fieldTypeConstants.Type.NONNEGCURRENCY:case fieldTypeConstants.Type.CURRENCY:case fieldTypeConstants.Type.CURRENCY2:return formatter.parse(value,type,false,true);case fieldTypeConstants.Type.DATETIME:case fieldTypeConstants.Type.DATETIMETZ:return dateTimeZone.parse(value,timezone);default:return value;}}
function doFormat(options,type)
{var value,timezone=null,undef=undefined;if(type!==undef)
{value=options;}
else if(options!==undef&&options!==null)
{value=options.value;type=options.type;timezone=options.timezone||null;}
utilityFunctions.checkArgs([value,type],['value','type'],'format');switch(type)
{case fieldTypeConstants.Type.DATE:case fieldTypeConstants.Type.TIME:case fieldTypeConstants.Type.TIMETRACK:case fieldTypeConstants.Type.TIMEOFDAY:case fieldTypeConstants.Type.INTEGER:case fieldTypeConstants.Type.POSINTEGER:case fieldTypeConstants.Type.PERCENT:case fieldTypeConstants.Type.FLOAT:case fieldTypeConstants.Type.POSFLOAT:case fieldTypeConstants.Type.NONNEGFLOAT:case fieldTypeConstants.Type.POSCURRENCY:case fieldTypeConstants.Type.NONNEGCURRENCY:case fieldTypeConstants.Type.CURRENCY:case fieldTypeConstants.Type.CURRENCY2:case fieldTypeConstants.Type.CHECKBOX:case fieldTypeConstants.Type.PHONE:case fieldTypeConstants.Type.FULLPHONE:case fieldTypeConstants.Type.MMYYDATE:case fieldTypeConstants.Type.RATE:case fieldTypeConstants.Type.RATEHIGHPRECISION:return formatter.format(value,type);case fieldTypeConstants.Type.DATETIME:case fieldTypeConstants.Type.DATETIMETZ:return dateTimeZone.format(value,timezone);default:return value;}}
return Object.freeze({parse:doParse,format:doFormat,Type:fieldTypeConstants.Type,Timezone:dateTimeZone.Timezone});});define('N/restricted/currencyApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/currency',['N/restricted/invoker','N/restricted/currencyApi','N/format','N/fieldTypeConstants','N/utilityFunctions','N/error'],function(invoker,currencyApi,format,fieldTypeConstants,utilityFunctions,error)
{function getExchRate(options)
{var sourceCurrency,targetCurrency;if(options!=null&&(options.hasOwnProperty('source')||options.hasOwnProperty('target')))
{sourceCurrency=options.source;targetCurrency=options.target;}
utilityFunctions.checkArgs([sourceCurrency,targetCurrency],['source','target'],'exchangeRate');var effectiveDate=options.date||new Date();if(!util.isDate(effectiveDate))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.date','date');}
else
{effectiveDate=format.format(effectiveDate,fieldTypeConstants.Type.DATE);}
try
{return parseFloat(invoker(currencyApi,'nlapiExchangeRate',[sourceCurrency,targetCurrency,effectiveDate],null,false));}
catch(e)
{var err=e;var msg=!!e.message?e.message.replace("fromCurrency","source").replace("toCurrency","target"):"";if(e.name==="INVALID_CUR")
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_CURRENCY_ID,msg);}
throw err;}}
return Object.freeze({exchangeRate:getExchRate})});define('N/restricted/scriptSessionContext',['N/restricted/reflet'],function(reflet){return reflet.nlapiGetContext();});define('N/restricted/scriptDeploymentContext',['N/restricted/reflet'],function(reflet){return reflet.nlapiGetContext();});define('N/restricted/scriptSessionObjectService',['N/restricted/reflet'],function(reflet){return reflet.nlapiGetContext();});define('N/restricted/scriptWorkQueueContext',['N/restricted/reflet'],function(reflet){return reflet.nlapiGetContext();});define('N/restricted/bridge',['N/restricted/reflet'],function(reflet){return reflet;});define('N/runtime',['N/restricted/scriptSessionContext','N/restricted/scriptDeploymentContext','N/restricted/scriptSessionObjectService','N/restricted/scriptWorkQueueContext','N/restricted/bridge','N/error','N/nsobject','N/restricted/invoker','N/utilityFunctions','N/util/formatter','N/util'],function(scriptSessionContext,scriptDeploymentContext,scriptSessionObjectService,scriptWorkQueueContext,apiBridge,error,nsobject,invoker,utilityFunctions,formatter,util)
{var ENV_TYPES=Object.freeze({SANDBOX:'SANDBOX',PRODUCTION:'PRODUCTION',BETA:'BETA',INTERNAL:'INTERNAL'});var PERMISSION=Object.freeze({FULL:4,EDIT:3,CREATE:2,VIEW:1,NONE:0});function Script()
{Object.defineProperty(this,'logLevel',{get:function()
{return invoker(scriptDeploymentContext,'getLogLevel');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.Script.logLevel');},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function()
{return invoker(scriptDeploymentContext,'getScriptId');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.Script.id');},enumerable:true,configurable:false});Object.defineProperty(this,'apiVersion',{get:function()
{return invoker(scriptDeploymentContext,'getRuntimeVersion');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.Script.apiVersion');},enumerable:true,configurable:false});Object.defineProperty(this,'deploymentId',{get:function()
{return invoker(scriptDeploymentContext,'getDeploymentId');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.Script.deploymentId');},enumerable:true,configurable:false});Object.defineProperty(this,'bundleIds',{get:function()
{return invoker(scriptDeploymentContext,'getBundleIds').map(String);},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.Script.bundleIds');},enumerable:true,configurable:false});this.getRemainingUsage=function getRemainingUsage()
{return invoker(scriptSessionContext,'getRemainingUsage');};this.getParameter=function getParameter(options)
{var name=options;if(utilityFunctions.isObject(options))
{name=options.name;}
utilityFunctions.checkArgs([name],['name'],'Script.getParameter');if(!util.isString(name))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'name','string');}
var pValue=invoker(scriptDeploymentContext,'getPreferenceObject',[name]);var pType=invoker(scriptDeploymentContext,'getPreferenceType',[name]);return formatter.parse(pValue,pType);};Object.defineProperty(this,'percentComplete',{get:function()
{return invoker(scriptWorkQueueContext,'getPercentComplete');},set:function(val)
{return invoker(scriptWorkQueueContext,'setPercentComplete',[val]);},enumerable:true,configurable:false});function toJSON()
{return{'id':this.id,'deploymentId':this.deploymentId,'logLevel':this.logLevel,'bundleIds':this.bundleIds};}
function toString()
{return 'runtime.Script';}
this.toJSON=toJSON;this.toString=toString;}
function Session()
{this.get=function get(options)
{var name=options;if(utilityFunctions.isObject(options))
{name=options.name;}
utilityFunctions.checkArgs([name],['name'],'Session.get');return invoker(scriptSessionObjectService,'getSessionObject',[name]);}
this.set=function set(options,value)
{var name=options;if(utilityFunctions.isObject(options))
{name=options.name;value=options.value;}
utilityFunctions.checkArgs([name],['name'],'Session.set');return invoker(scriptSessionObjectService,'setSessionObject',[name,value]);}
function toJSON()
{var keys=invoker(scriptSessionObjectService,'getAllSessionObjects');var result=new Object();for(var i=0;i<keys.length;i++)
{result[keys[i]]=invoker(scriptSessionObjectService,'getSessionObject',[keys[i]]);}
return result;}
function toString()
{return "runtime.Session";}
this.toJSON=toJSON;this.toString=toString;}
function User()
{Object.defineProperty(this,'email',{get:function()
{return invoker(scriptSessionContext,'getEmail');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.email');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'name',{get:function()
{return invoker(scriptSessionContext,'getName');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.name');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'location',{get:function()
{return invoker(scriptSessionContext,'getLocation');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.location');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'department',{get:function()
{return invoker(scriptSessionContext,'getDepartment');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.department');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'role',{get:function()
{return invoker(scriptSessionContext,'getRole');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.role');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'roleCenter',{get:function()
{return invoker(scriptSessionContext,'getRoleCenter');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.roleCenter');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'roleId',{get:function()
{return invoker(scriptSessionContext,'getRoleId');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.roleId');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'id',{get:function()
{return invoker(scriptSessionContext,'getUser');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.id');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'subsidiary',{get:function()
{return invoker(scriptSessionContext,'getSubsidiary');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'runtime.User.subsidiary');},enumerable:true,configurable:false,writeable:false});this.getPermission=function getPermission(options)
{var name=options;if(utilityFunctions.isObject(options))
{name=options.name;}
utilityFunctions.checkArgs([name],['name'],'User.getPermission');if(typeof name!="string")
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'name','string');}
return invoker(scriptSessionContext,'getPermission',[name]);}
this.getPreference=function getPreference(options)
{var name=options;if(utilityFunctions.isObject(options))
{name=options.name;}
utilityFunctions.checkArgs([name],['name'],'User.getPreference');if(!util.isString(name))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'name','string');}
var pValue=invoker(scriptDeploymentContext,'getPreference',[name]);var pType=invoker(scriptDeploymentContext,'getPreferenceType',[name]);if(('T'===pValue||'F'===pValue)&&('boolean'===pType))
return 'T'===pValue;else
return pValue;}
function toJSON()
{return{'id':this.id,'name':this.name,'email':this.email,'location':this.location,'department':this.department,'role':this.role,'roleId':this.roleId,'roleCenter':this.roleCenter,'subsidiary':this.subsidiary};}
function toString()
{return 'runtime.User';}
this.toJSON=toJSON;this.toString=toString;}
Session.prototype=nsobject.getNewInstance();User.prototype=nsobject.getNewInstance();Script.prototype=nsobject.getNewInstance();function Runtime()
{var _contextTypes;this.getCurrentUser=function getCurrentUser()
{return Object.freeze(new User());}
this.getCurrentScript=function getCurrentScript()
{return Object.freeze(new Script());}
this.getCurrentSession=function getCurrentSession()
{return Object.freeze(new Session());}
this.isFeatureInEffect=function isFeatureInEffect(options)
{var feature=options;if(utilityFunctions.isObject(options))
{feature=options.feature;}
utilityFunctions.checkArgs([options],['options.feature'],'runtime.isFeatureInEffect');if(!util.isString(feature))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'feature','string');}
return invoker(scriptSessionContext,'getFeature',[feature]);};Object.defineProperty(this,'queueCount',{get:function()
{return invoker(scriptWorkQueueContext,'getQueueCount');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'queueCount');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'processorCount',{get:function()
{return invoker(scriptWorkQueueContext,'getProcessorCount');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'processorCount');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'version',{get:function()
{return invoker(scriptSessionContext,'getVersion');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'version');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'accountId',{get:function()
{return invoker(scriptSessionContext,'getCompany');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'accountId');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'envType',{get:function()
{return invoker(scriptSessionContext,'getEnvironment');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'envType');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'executionContext',{get:function()
{var toRet=invoker(scriptSessionContext,'getExecutionContext');return toRet==null?null:toRet.toUpperCase();},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'executionContext');},enumerable:true,configurable:false,writeable:false});this.toJSON=function toJSON()
{return{};}
this.toString=function toString()
{return "runtime";}
this.setupScriptRun=function setupScriptRun(scriptObject)
{invoker(apiBridge,"setupScript",[scriptObject]);}
this.EnvType=ENV_TYPES;Object.defineProperty(this,'ContextType',{get:function()
{if(!_contextTypes)
_contextTypes=invoker(scriptSessionContext,'getExecutionContextTypes');return _contextTypes;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'ContextType');},enumerable:true,configurable:false,writeable:false});this.Permission=PERMISSION;};Runtime.prototype=nsobject.getNewInstance();return Object.freeze(new Runtime());});define('N/action',['N/restricted/remoteApiBridge','N/restricted/invoker','N/utilityFunctions','N/error'],function(remoteApi,invoker,utilityFunctions,error)
{var actionCache={};function promiseTo(fn,options,postProcess)
{var myPromise=new Promise(function(resolve,reject)
{function callback(result,exception)
{if(exception)
{reject(exception);return;}
try
{resolve(postProcess?postProcess(result,options):result);}
catch(e)
{reject(e);}}
try
{fn(options,callback);}
catch(e)
{reject(e);}});return myPromise;}
function doExecuteAction(options,callback)
{var recordType,recordId,pkg,actionId,params;if(options)
{recordType=options.recordType;params=utilityFunctions.isObject(options.params)?options.params:{};recordId=params.recordId;actionId=options.id;pkg=options['package']||null;}
utilityFunctions.checkArgs([recordType,recordId,actionId],['recordType','params.recordId','id'],'action.executeAction');return invoker(remoteApi,'executeAction',[recordType,pkg,actionId,recordId,params],callback,false);}
function executeAction(options)
{return JSON.parse(doExecuteAction(options,null));}
executeAction.promise=function(options)
{return promiseTo(doExecuteAction,options,JSON.parse);};function createAction(options,recordId)
{var TYPE='Action';var recordType=options.recordType.toLowerCase();var pkg=options['package']||null;var actionId=options.id;var Action=function(params)
{return executeAction(combineOpts(params,recordType,recordId,actionId,pkg));};Action.execute=function(params)
{return executeAction(combineOpts(params,recordType,recordId,actionId,pkg));};Action.promise=function(params)
{return promiseTo(doExecuteAction,combineOpts(params,recordType,recordId,actionId,pkg),JSON.parse);};Action.execute.promise=Action.promise;Action.id=actionId;Action.recordType=recordType;Action.recordId=recordId;Action['package']=pkg;Action.label=options.label||null;Action.description=options.description||null;var params={};options.parameters.forEach(function(p){params[p.id]=p;delete p.id;});Action.parameters=params;Action.toJSON=function toJSON(concise)
{var res={};for(var p in Action)
{if(Action.hasOwnProperty(p)&&typeof Action[p]!=='function')
{if(!concise||(Action[p]!=null&&(Action[p].constructor!==Object||Object.keys(Action[p]).length>0)))
res[p]=Action[p];}}
return res;};Action.toString=function toString()
{return TYPE+JSON.stringify(Action.toJSON(true));};return Object.freeze(Action);}
function combineOpts(params,recordType,recordId,actionId,pkg)
{var combinedOpts={};combinedOpts.params=util.extend(recordId?{recordId:recordId}:{},params);combinedOpts.recordType=recordType;combinedOpts.id=actionId;combinedOpts['package']=pkg;return combinedOpts;}
function processGetActionsResult(jsonRes,options)
{var metadata=JSON.parse(jsonRes);if(!options.recordId)
actionCache[options.recordType.toLowerCase()]=jsonRes;var Actions={};for(var i=0;i<metadata.length;i++)
{if(options.id&&options.id!==metadata[i].id)
continue;var action=createAction(metadata[i],options.recordId);var fullId=action['package']?action['package']+'.'+action.id:action.id;Actions[fullId]=action;}
return Object.freeze(Actions);}
function doGetActions(options,callback)
{var recordType=options?options.recordType:null;utilityFunctions.checkArgs([recordType],['recordType'],'action.getActions');recordType=recordType.toLowerCase();var actionId=options.id||null;var recordId=options.recordId||null;if(recordId||!actionCache[recordType])
return invoker(remoteApi,'getRecordActions',[recordType,recordId,actionId],callback,false);if(callback)
callback(actionCache[recordType]);else
return actionCache[recordType];}
function getActions(options)
{return processGetActionsResult(doGetActions(options,null),options);}
getActions.promise=function(options)
{return promiseTo(doGetActions,options,processGetActionsResult);};function processGetActionResult(jsonRes,options)
{var metadata=JSON.parse(jsonRes);if(!options.recordId)
actionCache[options.recordType.toLowerCase()]=jsonRes;var result=null;var pkg=options['package']||'';for(var i=0;i<metadata.length;i++)
{var curPkg=metadata[i]['package']||'';if(curPkg===pkg&&options.id===metadata[i].id)
{result=createAction(metadata[i],options.recordId);break;}}
if(result===null)
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_ACTION_ID);return result;}
function doGetAction(options,callback)
{var recordType,actionId;if(options)
{recordType=options.recordType;actionId=options.id;}
utilityFunctions.checkArgs([recordType,actionId],['recordType','id'],'action.getAction');return doGetActions(options,callback);}
function getAction(options)
{return processGetActionResult(doGetAction(options,null),options);}
getAction.promise=function(options)
{return promiseTo(doGetAction,options,processGetActionResult);};return Object.freeze({find:getActions,get:getAction,execute:executeAction});});define('N/restricted/queryApiBridge',['N/restricted/reflet'],function(reflet){return util.extend({bridge:'queryApiBridge'},reflet);});define('N/queryInternal',['N/restricted/invoker','N/restricted/queryApiBridge','N/utilityFunctions','N/error'],function(invoker,queryApiBridge,utilityFunctions,error)
{var searchTypes;var searchTypeValues;var sortLocales;function getSearchTypes()
{if(!searchTypes)
{var searchTypeData=invoker(queryApiBridge,"getSearchTypes",[]);searchTypes=searchTypeData.searchTypes;searchTypeValues=searchTypeData.searchTypeValues;}
return searchTypes;}
function validateSearchType(type)
{getSearchTypes();if(searchTypeValues.indexOf(type)<0)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SEARCH_TYPE,type);}
function getSearchTypes()
{if(!searchTypes)
{var searchTypeData=invoker(queryApiBridge,"getSearchTypes",[]);searchTypes=searchTypeData.searchTypes;searchTypeValues=searchTypeData.searchTypeValues;}
return searchTypes;}
function validateSortLocale(locale)
{getSortLocales();if(!sortLocales[locale])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SORT_LOCALE,locale);}
function getSortLocales()
{if(!sortLocales)
sortLocales=invoker(queryApiBridge,"getSortLocales",[]);return sortLocales;}
return{getSearchTypes:getSearchTypes,validateSearchType:validateSearchType,getSortLocales:getSortLocales,validateSortLocale:validateSortLocale}});define('N/search/pagingUtil',[],function(){var PAGE_SIZE_MIN=5,PAGE_SIZE_MAX=1000,PAGE_SIZE_DEFAULT=50;function regulatePageSize(pageSize)
{var size=parseInt(pageSize);var result=isNaN(size)?PAGE_SIZE_DEFAULT:size;result=result<PAGE_SIZE_MIN?PAGE_SIZE_MIN:result;result=result>PAGE_SIZE_MAX?PAGE_SIZE_MAX:result;return result;}
return{regulatePageSize:regulatePageSize};});define('N/query',['N/restricted/queryApiBridge','N/queryInternal','N/restricted/invoker','N/nsobject','N/utilityFunctions','N/error','N/common/pattern/iterator','N/search/pagingUtil'],function(queryApi,queryInternal,invoker,nsobject,utilityFunctions,error,iteratorFactory,pagingUtil)
{var MOD_PREFIX='query.';var OPERATOR=Object.freeze({AFTER:'AFTER',AFTER_NOT:'AFTER_NOT',ANY_OF:'ANY_OF',ANY_OF_NOT:'ANY_OF_NOT',BEFORE:'BEFORE',BEFORE_NOT:'BEFORE_NOT',BETWEEN:'BETWEEN',BETWEEN_NOT:'BETWEEN_NOT',CONTAIN:'CONTAIN',CONTAIN_NOT:'CONTAIN_NOT',EMPTY:'EMPTY',EMPTY_NOT:'EMPTY_NOT',ENDWITH:'ENDWITH',ENDWITH_NOT:'ENDWITH_NOT',EQUAL:'EQUAL',EQUAL_NOT:'EQUAL_NOT',GREATER:'GREATER',GREATER_NOT:'GREATER_NOT',GREATER_OR_EQUAL:'GREATER_OR_EQUAL',GREATER_OR_EQUAL_NOT:'GREATER_OR_EQUAL_NOT',IS:'IS',IS_NOT:'IS_NOT',LESS:'LESS',LESS_NOT:'LESS_NOT',LESS_OR_EQUAL:'LESS_OR_EQUAL',LESS_OR_EQUAL_NOT:'LESS_OR_EQUAL_NOT',ON:'ON',ON_NOT:'ON_NOT',ON_OR_AFTER:'ON_OR_AFTER',ON_OR_AFTER_NOT:'ON_OR_AFTER_NOT',ON_OR_BEFORE:'ON_OR_BEFORE',ON_OR_BEFORE_NOT:'ON_OR_BEFORE_NOT',START_WITH:'START_WITH',START_WITH_NOT:'START_WITH_NOT',WITHIN:'WITHIN',WITHIN_NOT:'WITHIN_NOT'});var ALLOWED_ARITY=Object.freeze({"AFTER":[2,2],"AFTER_NOT":[2,2],"ANY_OF":[2,Number.MAX_VALUE],"ANY_OF_NOT":[2,Number.MAX_VALUE],"BEFORE":[2,2],"BEFORE_NOT":[2,2],"BETWEEN":[3,3],"BETWEEN_NOT":[3,3],"CONTAIN":[2,2],"CONTAIN_NOT":[2,2],"EMPTY":[1,1],"EMPTY_NOT":[1,1],"ENDWITH":[2,2],"ENDWITH_NOT":[2,2],"EQUAL":[2,2],"EQUAL_NOT":[2,2],"GREATER":[2,2],"GREATER_NOT":[2,2],"GREATER_OR_EQUAL":[2,2],"GREATER_OR_EQUAL_NOT":[2,2],"IS":[2,2],"IS_NOT":[2,2],"LESS":[2,2],"LESS_NOT":[2,2],"LESS_OR_EQUAL":[2,2],"LESS_OR_EQUAL_NOT":[2,2],"ON":[2,2],"ON_NOT":[2,2],"ON_OR_AFTER":[2,2],"ON_OR_AFTER_NOT":[2,2],"ON_OR_BEFORE":[2,2],"ON_OR_BEFORE_NOT":[2,2],"START_WITH":[2,2],"START_WITH_NOT":[2,2],"WITHIN":[3,3],"WITHIN_NOT":[3,3]});var AGGREGATE=Object.freeze({AVERAGE:'AVERAGE',AVERAGE_DISTINCT:'AVERAGE_DISTINCT',COUNT:'COUNT',COUNT_DISTINCT:'COUNT_DISTINCT',MEDIAN:'MEDIAN',MAXIMUM:'MAXIMUM',MAXIMUM_DISTINCT:'MAXIMUM_DISTINCT',MINIMUM:'MINIMUM',MINIMUM_DISTINCT:'MINIMUM_DISTINCT',SUM:'SUM',SUM_DISTINCT:'SUM_DISTINCT'});var RETURN_TYPE=Object.freeze({BOOLEAN:'BOOLEAN',DATE:'DATE',DATETIME:'DATETIME',FLOAT:'FLOAT',INTEGER:'INTEGER',STRING:'STRING',DURATION:'DURATION',CURRENCY:'CURRENCY',KEY:'KEY',RELATIONSHIP:'RELATIONSHIP',ANY:'ANY',UNKNOWN:'UNKNOWN'});function SuiteQL(options)
{var TYPE=MOD_PREFIX+'SuiteQL';var _query=options.query;var _params=options.params;var _columns=options.columns;var _type=options.type;Object.defineProperty(this,'query',{get:function()
{return _query;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'query');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'params',{get:function()
{return _params;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'params');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'columns',{get:function()
{return _columns;},set:function(columns)
{if(!util.isArray(columns))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns','Column[]');for(var i=0;i<columns.length;i++)
{if(!(columns[i]instanceof Column))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns','Column[]');}
_columns=columns;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'type',{get:function()
{return _type;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false,writeable:false});this.run=function run()
{return runSuiteQL({query:_query,params:_params,columns:_columns,type:_type});};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{query:_query,params:_params,columns:_columns};};}
function Query(type,id,name)
{var TYPE=MOD_PREFIX+'Query';var _type=type;var _queryId=id||null;var _name=name||null;var _condition=null;var _columns=[];var _sort=[];var _root=new Component(type,null,null,null);Object.defineProperty(this,'type',{get:function()
{return _type;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'condition',{get:function()
{return _condition;},set:function(condition)
{if(!(condition instanceof Condition)&&condition!==null)
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'condition','Condition');_condition=condition;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'columns',{get:function()
{return _columns;},set:function(columns)
{if(!util.isArray(columns))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns','Column[]');for(var i=0;i<columns.length;i++)
{if(!(columns[i]instanceof Column))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns','Column[]');}
_columns=columns;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'sort',{get:function()
{return _sort;},set:function(sort)
{if(!util.isArray(sort))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'sort','Sort[]');for(var i=0;i<sort.length;i++)
{if(!(sort[i]instanceof Sort))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns','Sort[]');}
_sort=sort;},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'child',{get:function()
{return _root.child;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'child');},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'id',{get:function()
{return _queryId;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'id');},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'name',{get:function()
{return _name;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false,writeable:true});Object.defineProperty(this,'root',{get:function()
{return _root;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'root');},enumerable:true,configurable:false,writeable:true});this.run=function run()
{var data=invoker(queryApi,'runQuery',[this.marshal()]);var resultSet=new ResultSet(data,_columns);return resultSet;};this.runPaged=function runPaged(options)
{var pageSize=(options&&options.hasOwnProperty('pageSize'))?options.pageSize:options;pageSize=pagingUtil.regulatePageSize(pageSize);utilityFunctions.checkArgs([pageSize],['pageSize'],'Query.runPaged');var queryDefinition=this.marshal();var queryData=invoker(queryApi,"pagedQuery",[pageSize,queryDefinition]);return new PagedData({pageSize:pageSize,queryDefinition:queryDefinition,queryData:queryData,columns:_columns});};function promiseToQuery()
{var marshalled=this.marshal();return new Promise(function(resolve,reject){try{invoker(queryApi,'runQuery',[marshalled],callback);}
catch(e){reject(e);}
function callback(result,exception){if(exception){reject(exception);return;}
try{var resultSet=new ResultSet(result,_columns);resolve(resultSet);}
catch(e){reject(e);}}});}
function promiseToPaged(options)
{var marshalled=this.marshal();var pageSize=(options&&options.hasOwnProperty('pageSize'))?options.pageSize:options;pageSize=pagingUtil.regulatePageSize(pageSize);return new Promise(function(resolve,reject){try{utilityFunctions.checkArgs([pageSize],['pageSize'],'Query.runPaged');invoker(queryApi,"pagedQuery",[pageSize,marshalled],callback);}
catch(e){reject(e);}
function callback(result,exception){if(exception){reject(exception);return;}
try{resolve(new PagedData({pageSize:pageSize,queryDefinition:marshalled,queryData:result}));}
catch(e){reject(e);}}});}
this.run.promise=promiseToQuery.bind(this);this.runPaged.promise=promiseToPaged.bind(this);this.autoJoin=function autoJoin(options)
{return _root.autoJoin(options);};this.join=function join(options)
{return _root.join(options);};this.joinTo=function joinTo(options)
{return _root.joinTo(options);};this.joinFrom=function joinFrom(options)
{return _root.joinFrom(options);};this.createCondition=function createCondition(options)
{return _root.createCondition(options);};this.createColumn=function createColumn(options)
{return _root.createColumn(options);};this.createSort=function createSort(options)
{return _root.createSort(options);};function convertConditions(options)
{var newArguments=null;if(util.isObject(options)&&options.hasOwnProperty("conditions"))
newArguments=options.conditions;else if(util.isArray(options))
newArguments=options;else
newArguments=Array.prototype.slice.call(arguments);return newArguments;}
this.and=function and()
{utilityFunctions.checkArgs([arguments.length>0],['argument count'],'Query.and');return new Condition(convertConditions.apply(null,arguments),'AND',null);};this.or=function or()
{utilityFunctions.checkArgs([arguments.length>0],['argument count'],'Query.or');return new Condition(convertConditions.apply(null,arguments),'OR',null);};this.not=function not()
{utilityFunctions.checkArgs([arguments.length==1],['argument count'],'Query.not');return new Condition(convertConditions.apply(null,arguments),'NOT',null);};this.toSuiteQL=function toSuiteQL()
{var sql=invoker(queryApi,'toSuiteQL',[this.marshal()]);sql.columns=_columns;sql.type=_type;return new SuiteQL(sql);}
this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:_type,id:_queryId,name:_name,condition:_condition?_condition.toJSON():null,columns:jsonifyArray(_columns),sort:jsonifyArray(_sort),child:_root?jsonifyObject(_root.child):null,root:_root?_root.toJSON():null};};this.marshal=function marshal()
{var col=[];for(var i=0;i<_columns.length;i++)
col.push(_columns[i].marshal());return JSON.stringify({type:_type,id:_queryId,name:_name,condition:_condition?_condition.marshal():null,columns:col,sort:jsonifyArray(_sort,true,_columns)});};}
Query.prototype=nsobject.getNewInstance();function jsonifyArray(arr,marshal,aux)
{if(arr==null)
return null;var result=[];for(var i=0;i<arr.length;i++)
{result.push(marshal?arr[i].marshal(aux):arr[i].toJSON());}
return result;}
function jsonifyObject(obj,marshal)
{if(obj==null)
return null;var result={};for(var i in obj)
{if(obj.hasOwnProperty(i))
result[i]=marshal?obj[i].marshal():obj[i].toJSON();}
return result;}
function Component(type,target,source,parent)
{var TYPE=MOD_PREFIX+'Component';var _type=type;var _parent=parent;var _target=target;var _source=source;var _children={};Object.defineProperty(this,'type',{get:function()
{return _type;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'source',{get:function()
{return _source;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'source');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'target',{get:function()
{return _target;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'target');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'parent',{get:function()
{return _parent;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'parent');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'child',{get:function()
{return _children;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'child');},enumerable:true,configurable:false,writeable:false});this.autoJoin=function autoJoin(options)
{var type=(options&&options.hasOwnProperty('fieldId'))?options.fieldId:options;utilityFunctions.checkArgs([type],['fieldId'],'Component.autoJoin');utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(type,'options.fieldId',util.isString)]);if(!!_children[type])
utilityFunctions.throwSuiteScriptError(error.Type.RELATIONSHIP_ALREADY_USED,type);var result=new Component(type,null,null,this);_children[type]=result;return result;};this.join=function join(options)
{var type=(options&&options.hasOwnProperty('fieldId'))?options.fieldId:options;utilityFunctions.checkArgs([type],['fieldId'],'Component.join');utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(type,'options.fieldId',util.isString)]);if(!!_children[type])
utilityFunctions.throwSuiteScriptError(error.Type.RELATIONSHIP_ALREADY_USED,type);var result=new Component(type,null,null,this);_children[type]=result;return result;};this.joinTo=function joinTo(options)
{var type=(options&&options.hasOwnProperty('fieldId'))?options.fieldId:options;var target=(options&&options.hasOwnProperty('target'))?options.target:arguments[1];utilityFunctions.checkArgs([type,target],['fieldId','target'],'Component.joinTo');utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(type,'options.fieldId',util.isString)]);utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(target,'options.target',util.isString)]);if(!!_children[type])
utilityFunctions.throwSuiteScriptError(error.Type.RELATIONSHIP_ALREADY_USED,type);var result=new Component(type,target,null,this);_children[type]=result;return result;};this.joinFrom=function joinFrom(options)
{var type=(options&&options.hasOwnProperty('fieldId'))?options.fieldId:options;var source=(options&&options.hasOwnProperty('source'))?options.source:arguments[1];utilityFunctions.checkArgs([type,source],['fieldId','source'],'Component.joinFrom');utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(type,'options.fieldId',util.isString)]);utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(target,'options.source',util.isString)]);if(!!_children[type])
utilityFunctions.throwSuiteScriptError(error.Type.RELATIONSHIP_ALREADY_USED,type);var result=new Component(type,null,source,this);_children[type]=result;return result;};this.createCondition=function createCondition(options)
{utilityFunctions.checkArgs([options],['options'],'Component.createCondition');if(!util.isObject(options))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options','Object');return new Condition(null,options,this);};this.createColumn=function createColumn(options)
{utilityFunctions.checkArgs([options],['options'],'Component.createColumn');if(!util.isObject(options))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options','Object');return new Column(options,this);};this.createSort=function createSort(options)
{utilityFunctions.checkArgs([options],['options'],'Component.createColumn');if(!util.isObject(options))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options','Object');var column=options.column;utilityFunctions.checkArgs([column],['column'],'Component.createSort');if(!(column instanceof Column))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'column','Column');var locale;if(!util.isString(options.locale))
locale=null;else
{queryInternal.validateSortLocale(options.locale);locale=options.locale;}
var ascending=options.ascending==null?true:!!options.ascending;var nullsLast=options.nullsLast==null?ascending:!!options.nullsLast;var caseSensitive=!!options.caseSensitive;return new Sort(column,ascending,nullsLast,caseSensitive,locale);};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:_type,source:_source,target:_target,parent:_parent};};this.getJoins=function getJoins(field,includeRoot)
{var result=field;for(var comp=this;(includeRoot?comp:comp.parent)!=null;comp=comp.parent)
{if(comp.source)
result=comp.type+"#source="+comp.source+'.'+result;else if(comp.target)
result=comp.type+"#target="+comp.target+'.'+result;else
result=comp.type+'.'+result;}
return String(result);}}
Component.prototype=nsobject.getNewInstance();function Column(options,component)
{var TYPE=MOD_PREFIX+'Column';var _fieldId=options.fieldId?options.fieldId:null;var _component=component;var _formula=options.formula?options.formula:null;var _type=options.type?options.type:null;var _aggregate=options.aggregate?options.aggregate:null;var _groupBy=options.groupBy===true;if(!_fieldId&&!_formula)
utilityFunctions.throwSuiteScriptError(error.Type.NEITHER_ARGUMENT_DEFINED,'fieldId','formula');else if(_fieldId&&_formula)
utilityFunctions.throwSuiteScriptError(error.Type.MUTUALLY_EXCLUSIVE_ARGUMENTS,'fieldId','formula');if(_aggregate&&_groupBy)
utilityFunctions.throwSuiteScriptError(error.Type.MUTUALLY_EXCLUSIVE_ARGUMENTS,'aggregate','groupBy');if(_formula&&!RETURN_TYPE[_type])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FORMULA_TYPE,_type);if(_aggregate&&!AGGREGATE[_aggregate])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_AGGREGATE_TYPE,_aggregate);Object.defineProperty(this,'fieldId',{get:function()
{return _fieldId;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'fieldId');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'component',{get:function()
{return _component;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'component');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'formula',{get:function()
{return _formula;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'formula');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'type',{get:function()
{return _type;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'aggregate',{get:function()
{return _aggregate;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'aggregate');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'groupBy',{get:function()
{return _groupBy;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'groupBy');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{fieldId:_formula?null:_component?_component.getJoins(_fieldId,true):_fieldId,component:_component?_component.toJSON():null,formula:_formula,type:_type,aggregate:_aggregate,groupBy:_groupBy};};this.marshal=function marshal()
{var res={};if(_formula)
{res.formula=_formula;if(_type)
res.type=_type;}
else
{res.name=this.getJoins();}
if(_aggregate)
res.aggregate=_aggregate;if(_groupBy)
res.groupBy=_groupBy;if(_component)
{if(_component.target)
res.target=_component.target;if(_component.source)
res.source=_component.source;}
return res;};this.getJoins=function getJoins()
{return _component?_component.getJoins(_fieldId):_fieldId;}}
Column.prototype=nsobject.getNewInstance();function Sort(column,ascending,nullsLast,caseSensitive,locale)
{var TYPE=MOD_PREFIX+'Sort';var _column=column;var _ascending=ascending;var _nullsLast=nullsLast;var _caseSensitive=caseSensitive;var _locale=locale;Object.defineProperty(this,'column',{get:function()
{return _column;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'column');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'ascending',{get:function()
{return _ascending;},set:function(ascending)
{if(!util.isBoolean(ascending))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'ascending','Boolean');_ascending=ascending;},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'caseSensitive',{get:function()
{return _caseSensitive;},set:function(caseSensitive)
{if(!util.isBoolean(caseSensitive))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'caseSensitive','Boolean');_caseSensitive=caseSensitive;},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'nullsLast',{get:function()
{return _nullsLast;},set:function(nullsLast)
{if(!util.isBoolean(nullsLast))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'nullsLast','Boolean');_nullsLast=nullsLast;},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'locale',{get:function()
{return _locale;},set:function(locale)
{if(!util.isString(locale))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'locale','String');queryInternal.validateSortLocale(locale);_locale=locale;},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{column:_column?_column.toJSON():null,ascending:_ascending,nullsLast:_nullsLast,caseSensitive:_caseSensitive,locale:_locale};};this.marshal=function marshal(columns)
{var colOfs=-1;for(var i=0;i<columns.length;i++)
{if(columns[i]===_column)
{colOfs=i;break;}}
var res={col:colOfs,ascending:_ascending,caseSensitive:_caseSensitive,nullsLast:_nullsLast,locale:_locale};if(_column.component.target)
res.target=_column.component.target;if(_column.component.source)
res.source=_column.component.source;return res;};}
Sort.prototype=nsobject.getNewInstance();function Condition(children,options,component)
{var TYPE=MOD_PREFIX+'Condition';var undef=undefined;var _children=null;var _fieldId=null;var _op=null;var _values=null;var _formula=null;var _type=null;var _aggregate=null;var _component=null;if(children)
{_children=children;_op=options;}
else
{_fieldId=options.fieldId?options.fieldId:null;_op=options.operator?options.operator:null;_values=options.values===undef?null:options.values;_formula=options.formula?options.formula:null;_type=options.type?options.type:null;_aggregate=options.aggregate?options.aggregate:null;_component=component;if(!_fieldId&&!_formula)
utilityFunctions.throwSuiteScriptError(error.Type.NEITHER_ARGUMENT_DEFINED,'fieldId','formula');else if(_fieldId&&_formula)
utilityFunctions.throwSuiteScriptError(error.Type.MUTUALLY_EXCLUSIVE_ARGUMENTS,'fieldId','formula');utilityFunctions.checkArgs([_op],['operator'],'Component.createCondition');if(!OPERATOR[_op])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SEARCH_OPERATOR,_op);if(_formula&&!RETURN_TYPE[_type])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FORMULA_TYPE,_type);if(_aggregate&&!AGGREGATE[_aggregate])
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_AGGREGATE_TYPE,_aggregate);if(util.isArray(_values))
{for(var i=0;i<_values.length;i++)
{if(_values[i]===undef)
_values[i]=null;}}
var numValues=util.isArray(_values)?_values.length:_values===null?0:1;var arity=ALLOWED_ARITY[_op];if(numValues+1>arity[1]||numValues+1<arity[0])
utilityFunctions.throwSuiteScriptError(error.Type.OPERATOR_ARITY_MISMATCH,_op);}
Object.defineProperty(this,'children',{get:function()
{return _children;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'children');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'fieldId',{get:function()
{return _fieldId;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'fieldId');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'operator',{get:function()
{return _op;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'operator');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'values',{get:function()
{return _values;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'values');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'formula',{get:function()
{return _formula;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'formula');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'type',{get:function()
{return _type;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'aggregate',{get:function()
{return _aggregate;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'aggregate');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'component',{get:function()
{return _component;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'component');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{children:jsonifyArray(_children),fieldId:_fieldId,operator:_op,formula:_formula,type:_type,aggregate:_aggregate,values:_values,component:_component?_component.toJSON():null};};this.marshal=function marshal()
{var res={};if(_children)
{res.children=jsonifyArray(_children,true);res.operator=_op;}
else
{if(_formula)
{res.formula=_formula;res.type=_type;}
else
res.field=_component?_component.getJoins(_fieldId):_fieldId;res.operator=_op;res.values=_values;if(_component)
{if(_component.target)
res.target=_component.target;if(_component.source)
res.source=_component.source;}
if(_aggregate)
res.aggregate=_aggregate;}
return res;};}
Condition.prototype=nsobject.getNewInstance();function ResultSet(data,columns)
{var TYPE=MOD_PREFIX+'ResultSet';var _columns=columns;var _results=[];for(var i=0;i<data.count;i++)
{_results.push(new Result(Array.prototype.slice.call(data['v'+i]),columns));}
var _types=[];for(var i=0;i<data.types.length;i++)
{_types.push(data.types[i]);}
this.iterator=function iterator(){return iteratorFactory.create(new ResultsIterator(_results));};Object.defineProperty(this,'results',{get:function()
{return _results;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'results');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'types',{get:function()
{return _types;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'types');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'columns',{get:function()
{return _columns;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columns');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{columns:_columns,types:_types,results:_results};}}
ResultSet.prototype=nsobject.getNewInstance();function ResultsIterator(results){var i=0;this.hasNext=function hasNext(){return i<results.length;}
this.next=function next(){return results[i++];}}
ResultsIterator.prototype=nsobject.getNewInstance();function Result(values,columns)
{var TYPE=MOD_PREFIX+'Result';var _values=values;var _columns=columns;this.getValue=function getValue(options)
{return _values[options];};Object.defineProperty(this,'values',{get:function()
{return _values;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'values');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'columns',{get:function()
{return _columns;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columns');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{values:_values,columns:_columns};};}
Result.prototype=nsobject.getNewInstance();function createQuery(options)
{var type=(options&&options.hasOwnProperty('type'))?options.type:options;utilityFunctions.checkArgs([type],['type'],'createQuery');queryInternal.validateSearchType(type);var result=new Query(type);if(util.isObject(options.condition))
result.condition=result.createCondition(options.condition);if(util.isArray(options.columns))
{var cols=[];for(var i in options.columns)
cols.push(result.createColumn(options.columns[i]));result.columns=cols;}
if(util.isArray(options.sort))
{var sorts=[];for(var i in options.sort)
{var sort=options.sort[i];sort.column=result.createColumn(sort);sorts.push(result.createSort(sort));}
result.sort=sorts;}
return result;}
function PagedData(options)
{var TYPE=MOD_PREFIX+'PagedData';var pageSize=options.pageSize;var query=options.queryDefinition;var queryData=options.queryData;var columns=options.columns;var pageRanges=function()
{var ranges=[];for(var i=0;i<queryData.numPages;i++)
ranges.push(new PageRange({index:i,size:pageSize>0?pageSize*(i+1)>queryData.total?queryData.total%pageSize:pageSize:0}));return ranges;}();function validateAndGetIndex(options,length)
{var index=(options&&options.hasOwnProperty('index'))?options.index:options;utilityFunctions.checkArgs([index],['index'],'PagedData.fetch');index=parseInt(index);if(isNaN(index))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_INDEX,index);if(index<0||index>=length)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'fetch');return index;}
this.fetch=function(options)
{var index=validateAndGetIndex(options,queryData.pages.length);return new Page({resultSet:new ResultSet(invoker(queryApi,'getQueryPage',[queryData.pages[index],query]),columns),index:index,size:pageSize,total:queryData.total,pagedData:this,pageRange:pageRanges[index]});};function pagedPromise(query,queryData,columns,pageSize,options)
{var pagedData=this;return new Promise(function(resolve,reject){try{var index=validateAndGetIndex(options,queryData.pages.length);invoker(queryApi,'getQueryPage',[queryData.pages[index],query],callback);}
catch(e){reject(e);}
function callback(result,exception){if(exception){reject(exception);return;}
try{resolve(new Page({resultSet:new ResultSet(result,columns),index:index,size:pageSize,total:queryData.total,pagedData:pagedData,pageRange:pageRanges[index]}));}
catch(e){reject(e);}}});}
this.fetch.promise=pagedPromise.bind(this,query,queryData,columns,pageSize);this.iterator=function iterator(){return iteratorFactory.create(new PageIterator(this,queryData));};Object.defineProperty(this,'pageSize',{get:function()
{return pageSize;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageSize');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'count',{get:function()
{return queryData.total;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'totalResults');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'queryDefinition',{get:function()
{return query;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'queryDefinition');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'pageRanges',{get:function()
{return pageRanges;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageRanges');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{pageRanges:pageRanges,count:queryData.total,pageSize:pageSize,queryDefinition:query};};}
PagedData.prototype=nsobject.getNewInstance();function PageIterator(query,queryData){var i=0;this.hasNext=function hasNext(){return i<queryData.numPages;}
this.next=function next(){return query.fetch(i++);}}
PageIterator.prototype=nsobject.getNewInstance();function PageRange(options)
{var index=options.index;var size=options.size;Object.defineProperty(this,'index',{get:function()
{return index;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'index');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'size',{get:function()
{return size;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'size');},enumerable:true,configurable:false,writeable:false});}
function Page(options)
{var TYPE=MOD_PREFIX+'Page';var resultSet=options.resultSet;var pagedData=options.pagedData;var pageRange=options.pageRange;var isFirst=!!pageRange&&pageRange.index==0;var isLast=!!pageRange&&pagedData.pageRanges[pagedData.pageRanges.length-1]==pageRange;Object.defineProperty(this,'data',{get:function()
{return resultSet;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'data');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'pagedData',{get:function()
{return pagedData;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pagedData');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'pageRange',{get:function()
{return pageRange;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageRange');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'isFirst',{get:function()
{return isFirst;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isFirst');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'isLast',{get:function()
{return isLast;},set:function()
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isLast');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{pagedData:pagedData,data:resultSet,isFirst:isFirst,isLast:isLast,pageRange:pageRange};};}
Page.prototype=nsobject.getNewInstance();function handleJoins(fieldId,joinsMap,search)
{var joins=fieldId.split(".");var lastJoin=search;var joinId="";if(joins.length>1){for(var j=0;j<joins.length-1;j++){var join=joins[j];joinId+=join;var sourcePos=join.indexOf("#inverse=");var targetPos=join.indexOf("#polymorphic=");if(sourcePos>0){var src=join.substr(0,sourcePos);var field=join.substr(sourcePos+9);if(!joinsMap[joinId])
joinsMap[joinId]=lastJoin.joinFrom({fieldId:field,source:src});}
else if(targetPos>0){var field=join.substr(0,targetPos);var tgt=join.substr(targetPos+13);if(!joinsMap[joinId])
joinsMap[joinId]=lastJoin.joinTo({fieldId:field,target:tgt});}
else if(!joinsMap[joinId])
joinsMap[joinId]=lastJoin.autoJoin({fieldId:join});lastJoin=joinsMap[joinId];joinId+=".";}}
return{join:lastJoin,fieldId:joins[joins.length-1]};}
function loadQuery(options)
{var id=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([id],['id'],'query.load');if(!util.isNumber(id))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'id','Number');var data=invoker(queryApi,'loadSearch',[id]);var search=new Query(data.type,id,data.name);var joinsMap={};var columnMap={};for(var i=0;i<data.columns.length;i++)
{var column=data.columns[i];if(column.formula)
{var col=search.createColumn({formula:column.formula,type:column.type,aggregate:column.aggregate,groupBy:column.groupBy});search.columns.push(col);columnMap[column.formula]=col;}
else
{var handle=handleJoins(column.fieldId,joinsMap,search);var col=handle.join.createColumn({fieldId:handle.fieldId,aggregate:column.aggregate,groupBy:column.groupBy});search.columns.push(col);columnMap[column.fieldId]=col;}}
for(var i=0;i<data.sorts.length;i++)
{var column=data.sorts[i].column;var direction=data.sorts[i].direction;var ascending,nullsLast,caseSensitive,locale;if(direction=="DESCENDING_NULLS_LAST")
{ascending=false;nullsLast=true;}
else if(direction=="DESCENDING")
{ascending=false;nullsLast=false;}
else if(direction=="ASCENDING_NULLS_FIRST")
{ascending=true;nullsLast=false;}
else
{ascending=true;nullsLast=true;}
caseSensitive=data.sorts[i].caseSensitive;locale=data.sorts[i].locale;if(column.formula)
{if(columnMap[column.formula])
search.sort.push(search.createSort({column:columnMap[column.formula],ascending:ascending,nullsLast:nullsLast,caseSensitive:caseSensitive,locale:locale}));else
{var sortCol=search.createColumn({formula:column.formula,type:column.type,aggregate:column.aggregate,groupBy:column.groupBy});search.sort.push(search.createSort({column:sortCol,ascending:ascending,nullsLast:nullsLast,caseSensitive:caseSensitive,locale:locale}));}}
else
{var handle=handleJoins(column.fieldId,joinsMap,search);if(columnMap[handle.fieldId])
search.sort.push(handle.join.createSort({column:columnMap[handle.fieldId],ascending:ascending,nullsLast:nullsLast,caseSensitive:caseSensitive,locale:locale}));else
{var sortCol=handle.join.createColumn({fieldId:handle.fieldId,aggregate:column.aggregate,groupBy:column.groupBy});search.sort.push(search.createSort({column:sortCol,ascending:ascending,nullsLast:nullsLast,caseSensitive:caseSensitive,locale:locale}));}}}
search.condition=data.condition!=null?loadCondition(data.condition,joinsMap,search):null;return search;}
function loadCondition(condition,joinsMap,search)
{var components=[];if(condition.children)
{for(var i in condition.children)
{var nestedCondition=loadCondition(condition.children[i],joinsMap,search);if(nestedCondition!==null)
components.push(nestedCondition);}}
if(condition.filters)
{for(var i in condition.filters)
{if(condition.filters[i].formula)
{var filter=search.createCondition({formula:condition.filters[i].formula,values:condition.filters[i].values,operator:condition.filters[i].operator,type:condition.filters[i].type,aggregate:condition.filters[i].aggregate});components.push(filter);}
else
{var handle=handleJoins(condition.filters[i].fieldId,joinsMap,search);var filter=handle.join.createCondition({fieldId:handle.fieldId,values:condition.filters[i].values,operator:condition.filters[i].operator,aggregate:condition.filters[i].aggregate});components.push(filter);}}}
if(components.length==0)
return null;var rc=condition.operator==="AND"?search.and(components):search.or(components);if(condition.negation)
rc=search.not(rc);return rc;}
function deleteQuery(options)
{var id=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([id],['id'],'query.delete');invoker(queryApi,'deleteSearch',[id]);}
function runSuiteQL(options)
{var query=(options&&options.hasOwnProperty('query'))?options.query:options;var params=(options&&options.hasOwnProperty('params'))?options.params:[];var columns=(options&&options.hasOwnProperty('columns'))?options.columns:[];var type=(options&&options.hasOwnProperty('type'))?options.type:null;utilityFunctions.checkArgs([query],['query'],'query.runSuiteQL');utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(query,'options.query',util.isString)]);if(type!=null)
utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(type,'options.type',util.isString)]);utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(params,'options.params',util.isArray)]);utilityFunctions.checkArgTypes([utilityFunctions.checkArgObject(columns,'options.columns',util.isArray)]);for(var i in params)
{if(!util.isNumber(params[i])&&!util.isString[params[i]]&&!util.isBoolean(params[i]))
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_TYPE_ARG,'options.params['+i+']');}
var noInfo=type==null||columns.length==0;var search=noInfo?null:createQuery(type);var queryColumns=[];if(!noInfo)
{for(var i in columns){if(columns[i]instanceof Column)
queryColumns.push(columns[i]);else if(util.isObject(columns[i]))
queryColumns.push(search.createColumn(columns[i]));else if(util.isString(columns[i]))
queryColumns.push(search.createColumn({fieldId:columns[i]}))
else
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_TYPE_ARG,'options.columns['+i+']');}}
var col=[];if(!noInfo)
{for(var i=0;i<queryColumns.length;i++)
col.push(queryColumns[i].marshal());}
var data=invoker(queryApi,'runSuiteQL',[query,JSON.stringify(params),JSON.stringify(col),type]);var resultSet=new ResultSet(data,noInfo?undefined:queryColumns);return resultSet;}
return Object.freeze({create:createQuery,runSuiteQL:runSuiteQL,load:loadQuery,'delete':deleteQuery,Operator:OPERATOR,Aggregate:AGGREGATE,ReturnType:RETURN_TYPE,get SortLocale()
{return queryInternal.getSortLocales();},get Type()
{return queryInternal.getSearchTypes();}});});define('N/restricted/scriptArguments',[],function(){return{};});define('N/restricted/httpApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/restricted/marshalUtil',['N/restricted/reflet'],function(reflet){return reflet;});define('N/http/httpUtil',['N/restricted/scriptArguments','N/error','N/file','N/nsobject','N/restricted/invoker','N/utilityFunctions','N/restricted/httpApi','N/restricted/marshalUtil'],function(scriptArguments,error,file,nsobject,invoker,utilityFunctions,httpApi,marshalUtil)
{var METHODS=Object.freeze({GET:'GET',POST:'POST',PUT:'PUT',DELETE:'DELETE',HEAD:'HEAD'});var CACHE_DURATIONS=Object.freeze({UNIQUE:'UNIQUE',SHORT:'SHORT',MEDIUM:'MEDIUM',LONG:'LONG'});var REDIRECT_TYPES=Object.freeze({RECORD:'RECORD',SUITELET:'SUITELET',RESTLET:'RESTLET',MEDIA_ITEM:'MEDIAITEM',TASK_LINK:'TASKLINK'});function ClientResponse(delegate)
{var TYPE='http.ClientResponse';Object.defineProperty(this,'code',{get:function()
{return delegate.getCode?invoker(delegate,'getCode',[]):delegate.code;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'code');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'headers',{get:function()
{var headers={};if(delegate.getAllHeaders)
{var headerNames=invoker(delegate,'getAllHeaders',[]);var headers={};for(var i=0;i<headerNames.length;i++)
headers[headerNames[i]]=invoker(delegate,'getHeader',[headerNames[i]]);}
else
{headers=delegate.headers;}
return headers;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'headers');},enumerable:true,configurable:false,writeable:false});Object.defineProperty(this,'body',{get:function()
{return delegate.getBody?invoker(delegate,'getBody',[]):delegate.body;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'body');},enumerable:true,configurable:false,writeable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:TYPE,code:this.code,headers:this.headers,body:this.body};}}
ClientResponse.prototype=nsobject.getNewInstance();function checkParams(config,required,optional)
{checkConfig(config);for(var i=0;i<required.length;i++)
{if(!config[required[i]]&&config[required[i]]!==0)
utilityFunctions.throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,"options."+required[i]);}}
function checkConfig(config)
{if(!config)
utilityFunctions.throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,'options object');}
function runRequest(options,callback)
{var hasBody=options.method===this.Method.POST||options.method===this.Method.PUT;this.checkParams(options,hasBody?['method','url','body']:['method','url'],['headers']);var url=''+options.url;utilityFunctions.assertTrue((url.indexOf("https:")!==0),error.Type.SSS_INVALID_URL,"HTTP");var headers=options.headers||null;var isClient=typeof document!='undefined';if(url[0]=='/')
{utilityFunctions.assertTrue(isClient,error.Type.SSS_INVALID_URL,"HTTP");url='http://'+document.location.host+url;}
if(isClient)
{if(!headers)
headers={};}
headers=invoker(marshalUtil,"nsObjectToMap",[headers]);return invoker(httpApi,"nlapiRequestURL",[url,hasBody?options.body:null,headers,options.method],callback);}
return Object.freeze({Method:METHODS,CacheDuration:CACHE_DURATIONS,RedirectType:REDIRECT_TYPES,get:function get(config,headers,httpClient)
{checkConfig(config);if(!utilityFunctions.isObject(config))
{var url=config;config={url:url,headers:headers||null};}
config.method=this.Method.GET;return this.request(config,httpClient);},post:function post(config,httpClient)
{checkConfig(config);config.method=this.Method.POST;return this.request(config,httpClient);},put:function put(config,httpClient)
{checkConfig(config);config.method=this.Method.PUT;return this.request(config,httpClient);},'delete':function(config,headers,httpClient)
{checkConfig(config);if(!utilityFunctions.isObject(config))
{var url=config;config={url:url,headers:headers||null};}
config.method=this.Method.DELETE;return this.request(config,httpClient);},request:function request(options,httpClient)
{return httpClient.doRequest(options);},setRequester:function setRequester(val)
{requester=val;},createClientResponse:function createClientResponse(val)
{return new ClientResponse(val);},checkConfig:checkConfig,checkParams:checkParams,runRequest:runRequest,});});define('N/suiteletContext',['N/restricted/scriptArguments','N/error','N/file','N/nsobject','N/restricted/invoker','N/utilityFunctions','N/util'],function(scriptArguments,error,file,nsobject,invoker,utilityFunctions,util)
{function ServerRequest(delegate)
{var TYPE='http.ServerRequest';Object.defineProperty(this,'headers',{get:function()
{return invoker(delegate,'getAllHeaders',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'headers'});},enumerable:true,configurable:false});Object.defineProperty(this,'clientIpAddress',{get:function()
{return invoker(delegate,'getClientIpAddress',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'clientIpAddress'});},enumerable:true,configurable:false});Object.defineProperty(this,'parameters',{get:function()
{return invoker(delegate,'getAllParameters',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'parameters'});},enumerable:true,configurable:false});Object.defineProperty(this,'files',{get:function()
{var fileMap=invoker(delegate,'getAllFiles',[]);var files={};util.each(fileMap,function(val,key){files[key]=file.wrap(val);});return files;},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'files'});},enumerable:true,configurable:false});Object.defineProperty(this,'body',{get:function()
{return invoker(delegate,'getBody',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'body'});},enumerable:true,configurable:false});Object.defineProperty(this,'method',{get:function()
{return invoker(delegate,'getMethod',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'method'});},enumerable:true,configurable:false});Object.defineProperty(this,'url',{get:function()
{return invoker(delegate,'getURL',[]);},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'url'});},enumerable:true,configurable:false});this.getLineCount=function getLineCount(options)
{var group=(options&&options.hasOwnProperty('group'))?options.group:options;utilityFunctions.checkArgs([group],['group'],'ServerRequest.getLineCount');return invoker(delegate,'getLineItemCount',[group]);};this.getSublistValue=function getSublistValue(options)
{var group=null,name=null,line=null;if(options&&(options.hasOwnProperty('group')||options.hasOwnProperty('name')||options.hasOwnProperty('line')))
{group=options.group;name=options.name;line=options.line;}
else
{group=options;name=arguments[1];line=arguments[2];}
utilityFunctions.checkArgs([group,name,line],['group','name','line'],'ServerRequest.getSublistValue');return invoker(delegate,'getLineItemValue',[group,name,line+1]);};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:TYPE,method:this.method,url:this.url,parameters:this.parameters,headers:this.headers,clientIpAddress:this.clientIpAddress,files:this.files,body:this.body};}}
ServerRequest.prototype=nsobject.getNewInstance();function ServerResponse(delegate)
{var TYPE='http.ServerResponse';Object.defineProperty(this,'headers',{get:function()
{var headerNames=invoker(delegate,'getAllHeaders',[]);var headers={};for(var i=0;i<headerNames.length;i++)
{var values=delegate.getHeaders(headerNames[i]);headers[headerNames[i]]=values.length==1?values[0]:values;}
return headers;},set:function(val)
{throw error.create({name:error.Type.READ_ONLY_PROPERTY,message:'headers'});},enumerable:true,configurable:false});Object.defineProperty(this,'_assistantSendRedirect',{set:function(val)
{invoker(val.delegate,'sendRedirect',[delegate]);},enumerable:false,configurable:false});Object.defineProperty(this,'_renderToResponse',{set:function(val)
{return invoker(val,'renderToResponse',[delegate]);},enumerable:false,configurable:false});this.setHeader=function setHeader(options)
{var name=null,value=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('value')))
{name=options.name;value=options.value;}
else
{name=options;value=arguments[1];}
utilityFunctions.checkArgs([name,value],['name','value'],'ServerResponse.setHeader');invoker(delegate,'setHeader',[name,value]);};this.addHeader=function addHeader(options)
{var name=null,value=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('value')))
{name=options.name;value=options.value;}
else
{name=options;value=arguments[1];}
utilityFunctions.checkArgs([name,value],['name','value'],'ServerResponse.addHeader');invoker(delegate,'addHeader',[name,value]);};this.sendRedirect=function sendRedirect(options)
{var type=null,identifier=null,id=null,editMode=false,parameters=null;if(options&&(options.hasOwnProperty('type')||options.hasOwnProperty('identifier')))
{type=options.type;identifier=options.identifier;id=options.id?options.id:null;editMode=util.isBoolean(options.editMode)?options.editMode:false;parameters=typeof(options.parameters)==='object'?options.parameters:null;}
else
{type=options;identifier=arguments[1];id=arguments[2]?arguments[2]:null;editMode=util.isBoolean(arguments[3])?arguments[3]:false;parameters=typeof(arguments[4])==='object'?arguments[4]:null;}
utilityFunctions.checkArgs([type,identifier],['type','identifier'],'ServerResponse.sendRedirect');invoker(delegate,'sendRedirect',[type,identifier,id,editMode,parameters]);};this.write=function write(options)
{var output=(options&&options.hasOwnProperty('output'))?options.output:options;utilityFunctions.checkArgs([output],['output'],'ServerResponse.write');utilityFunctions.assertTrue(util.isString(output),error.Type.WRONG_PARAMETER_TYPE,'output');invoker(delegate,'write',[output]);};this.writeLine=function writeLine(options)
{var output=(options&&options.hasOwnProperty('output'))?options.output:options;utilityFunctions.checkArgs([output],['output'],'ServerResponse.writeLine');utilityFunctions.assertTrue(util.isString(output),error.Type.WRONG_PARAMETER_TYPE,'output');invoker(delegate,'writeLine',[output]);};this.writePage=function writePage(options)
{var pageObject=(options&&options.hasOwnProperty('pageObject'))?options.pageObject:options;utilityFunctions.checkArgs([pageObject],['pageObject'],'ServerResponse.writePage');pageObject._writeTo={'delegate':delegate}};this.writeFile=function writeFile(options)
{var fileObj=options&&options['file']!==undefined?options['file']:options;var isInline=options&&options['isInline']!==undefined?options['isInline']:arguments[1];utilityFunctions.checkArgs([fileObj],['file'],'ServerResponse.writeFile');if(fileObj.toString()!='file.File')
{throw error.create({name:error.Type.WRONG_PARAMETER_TYPE,message:'file'});}
fileObj._writeTo={'delegate':delegate,'isInline':isInline};};this.getHeader=function getHeader(options)
{var name=(options&&options.hasOwnProperty('name'))?options.name:options;utilityFunctions.checkArgs([name],['name'],'ServerResponse.getHeader');var values=invoker(delegate,'getHeaders',[name]);return values!=null?(values.length==1?values[0]:values):null;};this.renderPdf=function renderPdf(options)
{var xmlString=(options&&options.hasOwnProperty('xmlString'))?options.xmlString:options;utilityFunctions.checkArgs([xmlString],['xmlString'],'ServerResponse.renderPdf');invoker(delegate,'renderPDF',[xmlString]);};this.setCdnCacheable=function setCdnCacheable(options)
{var type=(options&&options.hasOwnProperty('type'))?options.type:options;utilityFunctions.checkArgs([type],['type'],'ServerResponse.setCdnCacheable');invoker(delegate,'setCDNCacheable',[type]);};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:TYPE,headers:this.headers};}}
ServerResponse.prototype=nsobject.getNewInstance();return Object.freeze({createServerRequest:function createServerRequest(delegate)
{return new ServerRequest(delegate);},createServerResponse:function createServerResponse(delegate)
{return new ServerResponse(delegate);},getServerRequest:function getServerRequest()
{return new ServerRequest(scriptArguments.request);},getServerResponse:function getServerResponse()
{return new ServerResponse(scriptArguments.response);},_ServerRequest:Object.freeze(ServerRequest)});});define('N/http',['N/http/httpUtil','N/suiteletContext'],function(httpUtil,suiteletContext)
{function requestProcess(options)
{var requestResponse=httpUtil.runRequest(options);return httpUtil.createClientResponse(requestResponse);}
function requestProcessPromise(options)
{var myPromise=new Promise(function(resolve,reject)
{try
{httpUtil.runRequest(options,callback)}
catch(e)
{reject(e);}
function callback(result,exception)
{if(exception)
{reject(exception)}
else
{try
{resolve(httpUtil.createClientResponse(result));}
catch(e)
{reject(e);}}}});return myPromise};var httpClient=Object.freeze({doRequest:requestProcess});var httpClientPromise=Object.freeze({doRequest:requestProcessPromise});function doGet(options,headers){return httpUtil.get(options,headers,httpClient)}
doGet.promise=function doGetPromise(options,headers){return httpUtil.get(options,headers,httpClientPromise)};function doPost(options){return httpUtil.post(options,httpClient)}
doPost.promise=function doPostPromise(options){return httpUtil.post(options,httpClientPromise)};function doPut(options){return httpUtil.put(options,httpClient)}
doPut.promise=function doPutPromise(options){return httpUtil.put(options,httpClientPromise)};function doDelete(options,headers){return httpUtil['delete'](options,headers,httpClient)}
doDelete.promise=function doDeletePromise(options,headers){return httpUtil['delete'](options,headers,httpClientPromise)};function doRequest(options){return httpUtil.request(options,httpClient)}
doRequest.promise=function doRequestPromise(options){return httpUtil.request(options,httpClientPromise)};return Object.freeze({Method:httpUtil.Method,CacheDuration:httpUtil.CacheDuration,get:doGet,post:doPost,put:doPut,'delete':doDelete,request:doRequest,getServerRequest:suiteletContext.getServerRequest,getServerResponse:suiteletContext.getServerResponse,RedirectType:httpUtil.RedirectType});});define('N/portlet',['N/error','N/utilityFunctions'],function(error,utilityFunctions)
{var SUPPORTED_PORTLET_TYPE='form';function refresh()
{if(typeof window.nlportlet==='object'&&window.nlportlet.type===SUPPORTED_PORTLET_TYPE)
window.nlportlet.refreshfn();else
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_UI_OBJECT_TYPE,window.nlportlet.type,SUPPORTED_PORTLET_TYPE);}
function resize()
{if(typeof window.nlportlet==='object'&&window.nlportlet.type===SUPPORTED_PORTLET_TYPE)
window.nlportlet.resizefn();else
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_UI_OBJECT_TYPE,window.nlportlet.type,SUPPORTED_PORTLET_TYPE);}
return Object.freeze({refresh:refresh,resize:resize})});define('N/restricted/xmlHelpers',['N/restricted/bridge'],function(apiBridge)
{function selectValues(node,expr)
{var selectedValues=[];var selections=apiBridge.nlapiSelectNodes(node,expr);if(selections!=null)
{selectedValues=[];for(var i=0;i<selections.length;i++)
selectedValues[i]=getXMLValue(selections[i]);}
return selectedValues;}
function selectValue(node,expr)
{var selections=selectValues(node,expr);var selection=selections!=null?selections[0]:null;return selection;}
function getXMLValue(node)
{if(node.nodeType==3||node.nodeType==4)
return node.nodeValue;if(node.nodeType==2)
return node.value;if(node.nodeType==9)
node=node.documentElement;var value=null;var elems=node.childNodes;for(var i=0;i<elems.length;i++)
{var elem=elems[i];if(elem.nodeType==3||elem.nodeType==4)
{if(value==null)
value=elem.nodeValue;else
value+=elem.nodeValue;}}
return value;}
return Object.freeze({nlapiSelectValue:selectValue});});define('N/restricted/ajaxHelpers',['N/restricted/bridge','N/restricted/xmlHelpers'],function(apiBridge,xmlHelpers)
{var trim=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/gm,'');};function isJson(body)
{if(!body)
return false;body=trim.call(body);return body&&body.indexOf('{')===0&&body.lastIndexOf('}')===body.length-1;}
function throwServerCallError(details,code,id)
{var error=Error(details);error.name=code;error.id=id;error.userFacing=false;throw error;}
function handleServerCallError(responseCode,responseBody,handleJson)
{if(responseBody&&responseBody.toLowerCase().indexOf('error')>=0)
{if(isJson(responseBody))
{if(handleJson&&responseBody.indexOf('{"error"')>=0)
{var errorBody=JSON.parse(responseBody);throwServerCallError(errorBody.error.message,errorBody.error.code);}}
else if(responseBody.indexOf('<onlineError>')>=0)
{var errorBody=apiBridge.nlapiStringToXML(responseBody);throwServerCallError(xmlHelpers.nlapiSelectValue(errorBody,'/onlineError/detail'),xmlHelpers.nlapiSelectValue(errorBody,'/onlineError/code'),xmlHelpers.nlapiSelectValue(errorBody,'/onlineError/id'));}
else if(responseBody.indexOf('<error>')>=0)
{var errorBody=apiBridge.nlapiStringToXML(responseBody);throwServerCallError(xmlHelpers.nlapiSelectValue(errorBody,'/error/message'),xmlHelpers.nlapiSelectValue(errorBody,'/error/code'));}
else if(responseBody.indexOf('error code:')>=0&&responseBody.indexOf('error message:')>=0&&responseCode!=200)
{var errorBody=responseBody.split("\n");throwServerCallError(errorBody[1].substring("error message: ".length),errorBody[0].substring("error code: ".length));}}
else if(responseCode!=200&&responseCode!=206)
throwServerCallError(responseBody,'SERVER_RESPONSE_ERROR');}
return Object.freeze({isJson:isJson,handleServerCallError:handleServerCallError});});define('N/https',['N/http/httpUtil','N/restricted/bridge','N/restricted/invoker','N/utilityFunctions','N/error','N/suiteletContext','N/restricted/httpApi','N/restricted/ajaxHelpers'],function(httpUtil,apiBridge,invoker,utilityFunctions,error,suiteletContext,httpApi,ajaxHelpers)
{function getHost()
{return document.location.protocol+'//'+document.location.host;}
function extractResponse(xhr,async)
{try
{ajaxHelpers.handleServerCallError(xhr.status,xhr.responseText,true);}
catch(e)
{if(async)
return e;else
throw error.create(e);}
apiBridge.chargeUsage('nlapiRequestURL');var responseHeaders=xhr.getAllResponseHeaders();var headers={};if(responseHeaders!=null)
{var headerLines=responseHeaders.split("\r\n");for(var i in headerLines)
{var header=headerLines[i].split(":")[0];if(!!header)
headers[header]=xhr.getResponseHeader(header);}}
else
headers=null;return{code:xhr.status,body:xhr.responseText,headers:headers};}
function runRequest(options,callback)
{utilityFunctions.checkArgs([options],["options"],"request");utilityFunctions.checkArgs([options.url],["options.url"],"request");var url=''+options.url;utilityFunctions.assertTrue((url.indexOf("http:")!==0),error.Type.SSS_INVALID_URL,"HTTPS");var body=(options.method===httpUtil.Method.POST||options.method===httpUtil.Method.PUT)?options.body:null;var headers=options.headers||{};if(typeof nsDefaultContextObj!=='undefined'&&nsDefaultContextObj!==null)
{url+=url.indexOf("?")>0?"&":"?";url+="c="+nsDefaultContextObj.company;url+="&isExternal=T";}
if(url[0]=='/'||url.indexOf(getHost())===0)
{var async=typeof(callback)==="function";var xhr=new XMLHttpRequest();xhr.open(options.method,url,async);if(async)
{var scriptRun;if(typeof apiBridge["getScript"]!=="undefined")
{scriptRun=apiBridge["getScript"].apply(apiBridge,[]);}
xhr.onload=function()
{if(!!scriptRun&&typeof apiBridge["recoverScript"]!=="undefined")
{apiBridge["recoverScript"].apply(apiBridge,[scriptRun]);window.NLScriptId=scriptRun.scriptId;}
if(this.readyState===4)
callback(extractResponse(xhr,true));}}
if(url.toLowerCase().indexOf("restlet.nl")>=0)
{if(util.isObject(body))
{xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8");body=JSON.stringify(body);}
else
{xhr.setRequestHeader("Content-Type","text/plain; charset=UTF-8");}}
else
{xhr.setRequestHeader("NSXMLHttpRequest","NSXMLHttpRequest");if(util.isObject(body))
{body=Object.keys(body).map(function(v){return encodeURIComponent(v)+'='+encodeURIComponent(body[v]);}).join('&');xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');}
else
{xhr.setRequestHeader("Content-Type","text/xml; charset=UTF-8");}}
xhr.send(body);if(!async)
return extractResponse(xhr,false);}
else
return invoker(httpApi,"nlapiRequestURLWithCredentials",[null,url,body,headers,options.method],callback);}
var requestProcess=function(options)
{var requestResponse=runRequest(options);return httpUtil.createClientResponse(requestResponse);};var requestProcessPromise=function(options)
{var myPromise=new Promise(function(resolve,reject)
{try
{runRequest(options,callback)}
catch(e)
{reject(e);}
function callback(result,exception)
{if(exception)
{reject(exception)}
else
{try
{resolve(httpUtil.createClientResponse(result));}
catch(e)
{reject(e);}}}});return myPromise};var httpClient=Object.freeze({doRequest:requestProcess});var httpClientPromise=Object.freeze({doRequest:requestProcessPromise});var doGet=function(options,headers){return httpUtil.get(options,headers,httpClient)};doGet.promise=function(options,headers){return httpUtil.get(options,headers,httpClientPromise)};var doPost=function(options){return httpUtil.post(options,httpClient)};doPost.promise=function(options){return httpUtil.post(options,httpClientPromise)};var doPut=function(options){return httpUtil.put(options,httpClient)};doPut.promise=function(options){return httpUtil.put(options,httpClientPromise)};var doDelete=function(options,headers){return httpUtil['delete'](options,headers,httpClient)};doDelete.promise=function(options,headers){return httpUtil['delete'](options,headers,httpClientPromise)};var doRequest=function(options){return httpUtil.request(options,httpClient)};doRequest.promise=function(options){return httpUtil.request(options,httpClientPromise)};return Object.freeze({Method:httpUtil.Method,CacheDuration:httpUtil.CacheDuration,get:doGet,post:doPost,put:doPut,'delete':doDelete,request:doRequest,getServerRequest:suiteletContext.getServerRequest,getServerResponse:suiteletContext.getServerResponse});});define('N/restricted/searchApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/search/searchPaging',['N/restricted/invoker','N/restricted/bridge','N/error','N/nsobject','N/search/pagingUtil'],function(invoker,api,error,nsobject,pagingUtil){function RemotePageRange(options)
{var index=options.index,compoundKey=options.compoundKey,compoundLabel=options.compoundLabel;this.getIndex=function getIndex(){return index;};this.getCompoundKey=function getCompoundKey(){return compoundKey;};this.getCompoundLabel=function getCompoundLabel(){return compoundLabel;};}
RemotePageRange.prototype=nsobject.getNewInstance();function RemotePage(options)
{var data=options.data,pageRange=new RemotePageRange(options.pageRange),_isFirst=options.isFirst,_isLast=options.isLast;this.getData=function getData(){return data;};this.getPageRange=function getPageRange(){return pageRange};this.isFirst=function isFirst(){return _isFirst;};this.isLast=function isLast(){return _isLast;};}
RemotePage.prototype=nsobject.getNewInstance();function RemotePagedData(options)
{var recordType=options.recordType,searchId=options.searchId,filters=options.filters,columns=options.columns,settings=options.settings,totalRows=isNaN(options.totalRows)?-1:options.totalRows,pageSize=isNaN(options.pageSize)?-1:options.pageSize,pageRanges=Array.isArray(options.pageRanges)&&options.pageRanges.map(function(v,i,a){return new RemotePageRange(v);})||[];this.getPageSize=function getPageSize(){return pageSize;};this.getTotalRows=function getTotalRows(){return totalRows;};this.getPageRanges=function getTotalRows(){return pageRanges;};this.getPage=function getPage(index){var pageRange=pageRanges[index],pageCount=pageRanges.length;return new RemotePage(invoker(api,'getSearchPage',[recordType,searchId,filters,columns,settings,pageRange.getCompoundKey(),pageRange.getCompoundLabel(),pageRange.getIndex(),pageSize,pageRanges[0].getCompoundKey(),pageRanges[pageCount-1].getCompoundKey(),pageCount,null]));};this.getPagePromise=function getPagePromise(index)
{return new Promise(function(resolve,reject){function callback(result,exception){if(exception)
{reject(exception);}
else
{resolve(new RemotePage(result));}}
try
{var pageRange=pageRanges[index],pageCount=pageRanges.length;invoker(api,'getSearchPage',[recordType,searchId,filters,columns,settings,pageRange.getCompoundKey(),pageRange.getCompoundLabel(),pageRange.getIndex(),pageSize,pageRanges[0].getCompoundKey(),pageRanges[pageCount-1].getCompoundKey(),pageCount,null],callback);}
catch(e)
{reject(e);}});}}
RemotePagedData.prototype=nsobject.getNewInstance();var SearchPaging={};SearchPaging.create=function create(options){var recordType=options.searchDefinition.searchType,searchId=options.searchDefinition.searchId,filters=options.filters,columns=options.columns,settings=options.settings,pageSize=pagingUtil.regulatePageSize(options.pageSize);var result=invoker(api,'getSearchPages',[recordType,searchId,filters,columns,settings,pageSize,null]);result.recordType=recordType;result.searchId=searchId;result.filters=filters;result.columns=columns;return new RemotePagedData(result);};SearchPaging.create.promise=function createPromise(options){var recordType=options.searchDefinition.searchType,searchId=options.searchDefinition.searchId,filters=options.filters,columns=options.columns,settings=options.settings,pageSize=pagingUtil.regulatePageSize(options.pageSize);return new Promise(function(resolve,reject){function callback(result,exception){if(exception)
{reject(exception);}
else
{result.recordType=recordType;result.searchId=searchId;result.filters=filters;result.columns=columns;result.settings=settings;resolve(new RemotePagedData(result));}}
try
{invoker(api,'getSearchPages',[recordType,searchId,filters,columns,settings,pageSize,null],callback);}
catch(e)
{reject(e);}});};return SearchPaging;});define('N/pagination/paginationObject',['N/nsobject','N/restricted/invoker','N/error','N/utilityFunctions'],function(nsobject,invoker,error,utilityFunctions)
{var interfaces={};function PagedData(delegate)
{var that=this;var pageRanges;function validateFetchParameter(options)
{var index;index=options!==undefined&&options!==null&&!util.isNumber(options)&&!util.isString(options)?options.index:options;utilityFunctions.checkArgs([index],['index'],'PagedData.fetch');return validateIndex(index);}
function validateIndex(index)
{var i=parseInt(index,10);if(isNaN(i))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_INDEX,index);return i;}
Object.defineProperty(this,'count',{get:function(){return delegate.count;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'count');},enumerable:true,configurable:false});Object.defineProperty(this,'pageRanges',{get:function(){if(!pageRanges)
{pageRanges=[];delegate.pageRanges.forEach(function(v){pageRanges.push(new PageRange(v));});}
return pageRanges;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageRanges');},enumerable:true,configurable:false});Object.defineProperty(this,'pageSize',{get:function(){return delegate.pageSize;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageSize');},enumerable:true,configurable:false});Object.defineProperty(this,'searchDefinition',{get:function(){return utilityFunctions.freezeObjectIfPossible(delegate.searchDefinition);},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'searchDefinition');},enumerable:true,configurable:false});this.fetch=function(options){var index=validateFetchParameter(options);return delegate.fetch(index);};if(delegate.fetch.promise)
{this.fetch.promise=function(options){var index=validateFetchParameter(options);return delegate.fetch.promise(index);}}
function toJSON(){return{count:that.count,pageRanges:that.pageRanges,pageSize:that.pageSize,searchDefinition:that.searchDefinition}}
function toString(){return "search.PagedData";}
this.toJSON=toJSON;this.toString=toString;}
PagedData.prototype=nsobject.getNewInstance();utilityFunctions.freezeObjectIfPossible(PagedData);interfaces.PagedData=PagedData;function ReadonlyPagedData(pagedData)
{var pageRanges;Object.defineProperty(this,'pageRanges',{get:function(){if(!pageRanges)
{pageRanges=[];pagedData.pageRanges.forEach(function(v){pageRanges.push(new PageRange(v));});}
return pageRanges;},enumerable:true,configurable:false});Object.defineProperty(this,'count',{value:pagedData.count,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'pageSize',{value:pagedData.pageSize,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'searchDefinition',{value:pagedData.searchDefinition,enumerable:true,configurable:false,writable:false});this.toJSON=pagedData.toJSON;this.toString=function(){return "search.PagedData(readonly)";}}
utilityFunctions.freezeObjectIfPossible(ReadonlyPagedData);function Page(delegate)
{var that=this;var _pageRange,readonlyPagedData;function getReadOnlyPagedDataInstance()
{if(!readonlyPagedData)
readonlyPagedData=utilityFunctions.freezeObjectIfPossible(new ReadonlyPagedData(delegate.pagedData));return readonlyPagedData;}
Object.defineProperty(this,'pagedData',{get:function(){return getReadOnlyPagedDataInstance(delegate.pagedData);},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pagedData');},enumerable:true,configurable:false});Object.defineProperty(this,'pageRange',{get:function(){if(!_pageRange)
{_pageRange=new PageRange(delegate.pageRange);}
return _pageRange;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'pageRange');},enumerable:true,configurable:false});Object.defineProperty(this,'isFirst',{get:function(){return delegate.isFirst;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isFirst');},enumerable:true,configurable:false});Object.defineProperty(this,'isLast',{get:function(){return delegate.isLast;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isLast');},enumerable:true,configurable:false});Object.defineProperty(this,'data',{get:function(){return delegate.data;},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'data');},enumerable:true,configurable:false});this.next=delegate.next;if(delegate.next.promise)
{this.next.promise=delegate.next.promise;}
this.prev=delegate.prev;if(delegate.prev.promise)
{this.prev.promise=delegate.prev.promise;}
function toJSON(){return{pagedData:that.pagedData,pageRange:that.pageRange,isFirst:that.isFirst,isLast:that.isLast,data:that.data}}
function toString(){return "search.Page";}
this.toJSON=toJSON;this.toString=toString;}
Page.prototype=nsobject.getNewInstance();utilityFunctions.freezeObjectIfPossible(Page);interfaces.Page=Page;function PageRange(delegate)
{var that=this;Object.defineProperty(this,'index',{get:function(){return invoker(delegate,'getIndex',[]);},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'index');},enumerable:true,configurable:false});Object.defineProperty(this,'compoundLabel',{get:function(){return invoker(delegate,'getCompoundLabel',[]);},set:function(val){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'compoundLabel');},enumerable:true,configurable:false});function toJSON(){return{index:that.index,compoundLabel:that.compoundLabel}}
function toString(){return "search.PageRange";}
this.toJSON=toJSON;this.toString=toString;}
PageRange.prototype=nsobject.getNewInstance();utilityFunctions.freezeObjectIfPossible(PageRange);interfaces.PageRange=PageRange;return Object.freeze(interfaces);});define('N/search/searchObject',['N/restricted/searchApi','N/restricted/remoteApiBridge','N/error','N/nsobject','N/restricted/invoker','N/search/searchPaging','N/pagination/paginationObject','N/utilityFunctions'],function(searchApi,remoteApi,error,nsobject,invoker,searchPaging,paginationObject,utilityFunctions)
{var OPERATORS=Object.freeze({AFTER:'after',ALLOF:'allof',ANY:'any',ANYOF:'anyof',BEFORE:'before',BETWEEN:'between',CONTAINS:'contains',DOESNOTCONTAIN:'doesnotcontain',DOESNOTSTARTWITH:'doesnotstartwith',EQUALTO:'equalto',GREATERTHAN:'greaterthan',GREATERTHANOREQUALTO:'greaterthanorequalto',HASKEYWORDS:'haskeywords',IS:'is',ISEMPTY:'isempty',ISNOT:'isnot',ISNOTEMPTY:'isnotempty',LESSTHAN:'lessthan',LESSTHANOREQUALTO:'lessthanorequalto',NONEOF:'noneof',NOTAFTER:'notafter',NOTALLOF:'notallof',NOTBEFORE:'notbefore',NOTBETWEEN:'notbetween',NOTEQUALTO:'notequalto',NOTGREATERTHAN:'notgreaterthan',NOTGREATERTHANOREQUALTO:'notgreaterthanorequalto',NOTLESSTHAN:'notlessthan',NOTLESSTHANOREQUALTO:'notlessthanorequalto',NOTON:'noton',NOTONORAFTER:'notonorafter',NOTONORBEFORE:'notonorbefore',NOTWITHIN:'notwithin',ON:'on',ONORAFTER:'onorafter',ONORBEFORE:'onorbefore',STARTSWITH:'startswith',WITHIN:'within'});var ARRAY_BASED_OPERATORS=[OPERATORS.ANYOF,OPERATORS.NONEOF,OPERATORS.ALLOF,OPERATORS.NOTALLOF];var PERIOD_OPERATORS=Object.freeze({ABS:"ABS",REL:"REL"});var SUMMARY_TYPES=Object.freeze({GROUP:'GROUP',COUNT:'COUNT',SUM:'SUM',AVG:'AVG',MIN:'MIN',MAX:'MAX'});var FUNCTIONS=Object.freeze({absoluteValue:'',ageInHours:'',ageInDays:'',ageInMonths:'',ageInWeeks:'',ageInYears:'',calendarWeek:'',day:'',month:'',negate:'',numberAsTime:'',percentOfTotal:'',quarter:'',rank:'',round:'',roundToHundredths:'',roundToTenths:'',weekOfYear:'',year:''});var SORT=Object.freeze({ASC:'ASC',DESC:'DESC',NONE:'NONE'});function applyValidationFunctionToArrayElement(array,func)
{if(!util.isArray(array))
return false;for(var i=0;i<array.length;++i)
{if(!func(array[i]))
return false;}
return true;}
function resolveUndefined(obj)
{return obj===undefined?null:obj;}
function resolveUndefinedForArguments(args)
{return args.map(function(v,i,a){return resolveUndefined(v);});}
function convertJsFiltersToJavaFilters(jsFilters)
{var javaFilters=[];for(var i=0;jsFilters&&i<jsFilters.length;i++)
{var filterState=jsFilters[i].toJSON();var useArray=filterState.operator&&ARRAY_BASED_OPERATORS.indexOf(filterState.operator.toLowerCase())>-1;var firstValue=(util.isArray(filterState.values))?useArray?filterState.values:filterState.values[0]:null;var secondValue=(util.isArray(filterState.values)&&!useArray)?filterState.values[1]:null;javaFilters[i]=invoker(searchApi,'createSearchFilter',[filterState.name,filterState.join||null,filterState.operator,firstValue,secondValue]);if(util.isString(filterState.formula))
javaFilters[i].setFormula(filterState.formula);if(util.isString(filterState.summarytype))
javaFilters[i].setSummaryType(filterState.summarytype);if(util.isBoolean(filterState.isor))
javaFilters[i].setOr(filterState.isor);if(util.isBoolean(filterState.isnot))
javaFilters[i].setNot(filterState.isnot);if(util.isNumber(filterState.leftparens))
javaFilters[i].setLeftParens(filterState.leftparens);if(util.isNumber(filterState.rightparens))
javaFilters[i].setRightParens(filterState.rightparens);}
return javaFilters;}
function convertJsColumnsToJavaColumns(jsColumns)
{var javaColumns=[];for(var i=0;jsColumns&&i<jsColumns.length;i++)
{var columnState=jsColumns[i].toJSON();javaColumns[i]=invoker(searchApi,'createSearchColumn',[columnState.name,columnState.join||null,columnState.summary||null]);if(util.isString(columnState.label))
javaColumns[i].setLabel(columnState.label);if(util.isString(columnState.sortdir)&&columnState.sortdir!==SORT.NONE)
javaColumns[i].setSort(columnState.sortdir===SORT.DESC);if(util.isString(columnState.formula))
javaColumns[i].setFormula(columnState.formula);if(util.isString(columnState['function']))
javaColumns[i].setFunction(columnState['function']);if(util.isString(columnState.whenorderedby))
javaColumns[i].setWhenOrderedBy(columnState.whenorderedby,columnState.whenorderedbyjoin);}
return javaColumns;}
function convertJsSettingsToJavaSettings(jsSettings)
{var javaSettings=[];for(var i=0;jsSettings&&i<jsSettings.length;i++)
{var settingState=jsSettings[i].toJSON();javaSettings[i]=invoker(searchApi,'createSearchSetting',[settingState.name,settingState.value]);}
return javaSettings;}
function Search(typeOrJavaSearch,searchId,filters,columns,settings)
{var that=this;var TYPE='search.Search';var javaSearch=!util.isString(typeOrJavaSearch)?typeOrJavaSearch:undefined;var jsSearch;var _type=util.isString(typeOrJavaSearch)?typeOrJavaSearch:null;var _searchId=searchId;var _filters;var _columns;var _settings;var _title=null;var _scriptId=null;var _isPublic=false;this._load=function load(callback)
{if(!javaSearch)
javaSearch=invoker(searchApi,'nlapiLoadSearch',[_type,_searchId],callback?loadCallback:null);if(!callback)
loadCallback(javaSearch);function loadCallback(javaSearch,exception)
{if(callback&&exception)
{callback(undefined,exception);return;}
jsSearch=invoker(remoteApi,'transform',[javaSearch]);_isPublic=jsSearch.ispublic;_searchId=(jsSearch.searchId===undefined||jsSearch.searchId===null)?null:parseInt(jsSearch.searchId,10);_scriptId=jsSearch.scriptid;_type=jsSearch.type;_filters=utilityFunctions.unmarshalArray(jsSearch,'filter',Filter.unmarshalFilter);_columns=utilityFunctions.unmarshalArray(jsSearch,'column',Column.unmarshalColumn);_settings=utilityFunctions.unmarshalArray(jsSearch,'setting',Setting.unmarshalSetting);if(callback)
callback(that);}};Object.defineProperty(this,'searchType',{get:function()
{return _type;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'searchType');},enumerable:true,configurable:false});Object.defineProperty(this,'searchId',{get:function()
{return _searchId;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'searchId');},enumerable:true,configurable:false});Object.defineProperty(this,'filters',{get:function()
{return _filters;},set:function(filters)
{_filters=filters?(util.isArray(filters)?filters:[filters]):null;if(_filters!==null)
{for(i=0;i<_filters.length;i++)
{if(util.isObject(_filters[i]))
_filters[i]=createFilter(_filters[i])
else if(!(_filters[i]instanceof Filter))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'filters['+i+']','Filter');}}},enumerable:true,configurable:false});Object.defineProperty(this,'_rawFilters',{get:function()
{return Filter.marshalFilters(_filters);},enumerable:false,configurable:false});Object.defineProperty(this,'filterExpression',{get:function()
{var rawFilters=Filter.marshalFilters(_filters);var payload=invoker(remoteApi,'buildSearchFilterExpression',[rawFilters]);payload=invoker(remoteApi,'transform',[payload]);return Filter.unmarshalFilterExpression(payload);},set:function(filterExpression)
{filterExpression=Filter.normalizeFilters(filterExpression);utilityFunctions.assertTrue(!applyValidationFunctionToArrayElement(filterExpression,Filter.isFilterObject),error.Type.WRONG_PARAMETER_TYPE,'filterExpression','Filter');_filters=Filter.parseFilterExpression(filterExpression);},enumerable:true,configurable:false});Object.defineProperty(this,'columns',{get:function()
{return _columns;},set:function(columns)
{_columns=columns?(util.isArray(columns)?columns:[columns]):null;if(_columns!==null)
{for(var i=0;i<_columns.length;i++)
{if(util.isObject(_columns[i]))
_columns[i]=createColumn(_columns[i])
else if(util.isString(_columns[i]))
_columns[i]=new Column(getNameFromColumn(_columns[i]),getJoinFromColumn(_columns[i]),null);else if(!(_columns[i]instanceof Column))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'columns['+i+']','Column');_columns[i]._setIndex(i+1);}}},enumerable:true,configurable:false});Object.defineProperty(this,'_rawColumns',{get:function()
{return Column.marshalColumns(_columns);},enumerable:false,configurable:false});Object.defineProperty(this,'settings',{get:function()
{return _settings;},set:function(settings)
{_settings=settings?(util.isArray(settings)?settings:[settings]):null;if(_settings!==null)
{for(var i=0;i<_settings.length;i++)
{if(util.isObject(_settings[i]))
_settings[i]=createSetting(_settings[i])
else if(util.isArray(_settings[i])&&_settings[i].length==2&&util.isString(_settings[i][0])&&util.isString(_settings[i][1]))
_settings[i]=new Setting(_settings[i][0],_settings[i][1]);else if(!(_settings[i]instanceof Setting))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'settings['+i+']','Setting');}}},enumerable:true,configurable:false});Object.defineProperty(this,'_rawSettings',{get:function()
{return Setting.marshalSettings(_settings);},enumerable:false,configurable:false});Object.defineProperty(this,'title',{get:function()
{return _title;},set:function(val)
{_title=val;},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function()
{return _scriptId;},set:function(val)
{_scriptId=val;},enumerable:true,configurable:false});Object.defineProperty(this,'isPublic',{get:function()
{return _isPublic;},set:function(val)
{_isPublic=val;},enumerable:true,configurable:false});function doSave(callback)
{var rawFilters=Filter.marshalFilters(_filters);var rawColumns=Column.marshalColumns(_columns);var rawSettings=Setting.marshalSettings(_settings);return invoker(searchApi,'nlapiSaveSearch',[_title,_scriptId,_type,_searchId,rawFilters,rawColumns,rawSettings,_isPublic],callback);}
this.save=function save()
{return parseInt(doSave(),10);};this.save.promise=function()
{var myPromise=new Promise(function(resolve,reject)
{try
{doSave(callback)}
catch(e)
{reject(e);}
function callback(result,exception)
{if(exception)
{reject(exception)}
else
{try
{resolve(parseInt(result,10));}
catch(e)
{reject(e);}}}});return myPromise;}
this.run=function run()
{return new ResultSet(clone());};this.runPaged=function runPaged(options)
{var pageSize=options&&options.pageSize;var pagedData=new SearchPagedData({delegate:searchPaging.create({searchDefinition:that,filters:Filter.marshalFilters(that.filters),columns:Column.marshalColumns(that.columns),settings:Setting.marshalSettings(that.settings),pageSize:pageSize}),searchDefinition:that});return new paginationObject.PagedData(pagedData);};this.runPaged.promise=function runPaged(options)
{var pageSize=options&&options.pageSize;return searchPaging.create.promise({searchDefinition:that,filters:Filter.marshalFilters(that.filters),columns:Column.marshalColumns(that.columns),settings:Setting.marshalSettings(that.settings),pageSize:pageSize}).then(function(value){var pagedData=new SearchPagedData({delegate:value,searchDefinition:that});return new paginationObject.PagedData(pagedData);});};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{type:_type,id:_searchId,filters:_filters,columns:_columns,settings:_settings,title:_title,scriptId:_scriptId,isPublic:_isPublic};};function clone()
{var i;var filtersCopy=[];for(i=0;_filters&&i<_filters.length;++i)
filtersCopy.push(_filters[i]._clone());var settingsCopy=[];for(i=0;_settings&&i<_settings.length;++i)
settingsCopy.push(_settings[i]._clone());var columnsCopy=[];for(i=0;_columns&&i<_columns.length;++i)
columnsCopy.push(_columns[i]._clone());var clone=new Search(_type,_searchId,filtersCopy,columnsCopy,settingsCopy);clone.title=_title;clone.id=_scriptId;clone.isPublic=_isPublic;return clone;}
this.redirectToSearch=function redirectToSearch()
{var javaFilters=convertJsFiltersToJavaFilters(_filters);var javaColumns=convertJsColumnsToJavaColumns(_columns);var javaSettings=convertJsSettingsToJavaSettings(_settings);if(!javaSearch){if(_searchId===-1||searchId==='-1')
javaSearch=invoker(searchApi,'nlapiCreateSearch',[_type,javaFilters,javaColumns,javaSettings]);else
{javaSearch=invoker(searchApi,'nlapiLoadSearch',[_type,_searchId]);javaSearch.addFilters(javaFilters);javaSearch.addColumns(javaColumns);}}
return invoker(javaSearch,'setRedirectURLToSearch',[]);};this.redirectToSearchResults=function redirectToSearchResults()
{var javaFilters=convertJsFiltersToJavaFilters(_filters);var javaColumns=convertJsColumnsToJavaColumns(_columns);var javaSettings=convertJsSettingsToJavaSettings(_settings);if(!javaSearch)
{if(_searchId===-1||searchId==='-1')
javaSearch=invoker(searchApi,'nlapiCreateSearch',[_type,javaFilters,javaColumns,javaSettings]);else
{javaSearch=invoker(searchApi,'nlapiLoadSearch',[_type,_searchId]);javaSearch.addFilters(javaFilters);javaSearch.addColumns(javaColumns);javaSearch.addSettings(javaSettings);}}
else
{javaSearch.addFilters(javaFilters);javaSearch.addColumns(javaColumns);}
return invoker(javaSearch,'setRedirectURLToSearchResults',[]);};this.filters=filters;this.columns=columns;this.settings=settings;}
Search.prototype=nsobject.getNewInstance();function Filter(name,join,operator,values)
{var TYPE='search.Filter';utilityFunctions.checkArgs([name,operator],['name','operator'],'search.Filter');var _name=name;var _join=join;if(!util.isString(operator)||(!OPERATORS[operator.toUpperCase()]&&!PERIOD_OPERATORS[operator.toUpperCase()]))
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SRCH_OPERATOR,operator+"","["+Object.keys(OPERATORS).join(", ")+"]");var _operator=operator;var _values=null;var formula=null;var summarytype=null;var isor=false;var isnot=false;var leftparens=0;var rightparens=0;addValue(values);function addValue(val)
{if(!_values)
_values=[];if(util.isArray(val))
{for(var i=0;i<val.length;i++)
{if(val[i]||val[i]===0)
_values.push(val[i].toString());}}
else if(val!==null&&val!==undefined)
_values.push(val.toString());return _values;}
this._clone=function _clone()
{var clone=new Filter(_name,_join,_operator,_values);clone._unmarshal(this._marshal());return clone;};this._unmarshal=function _unmarshal(filterJSON)
{formula=filterJSON.formula;summarytype=filterJSON.summarytype;isor=filterJSON.isor;isnot=filterJSON.isnot;leftparens=filterJSON.leftparens;rightparens=filterJSON.rightparens;};this._marshal=function _marshal()
{var filterObject={};filterObject.name=_name;filterObject.join=_join;filterObject.operator=_operator;filterObject.values=(!_values||_values.length===0)?null:_values;filterObject.formula=formula;filterObject.summarytype=summarytype;filterObject.isor=isor;filterObject.isnot=isnot;filterObject.leftparens=leftparens;filterObject.rightparens=rightparens;return filterObject;};Object.defineProperty(this,'name',{get:function()
{return _name;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false});Object.defineProperty(this,'join',{get:function()
{return _join;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'join');},enumerable:true,configurable:false});Object.defineProperty(this,'operator',{get:function()
{return _operator;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'operator');},enumerable:true,configurable:false});Object.defineProperty(this,'summary',{get:function()
{return summarytype;},set:function(type)
{if(type!==null)
{if(!util.isString(type)||!SUMMARY_TYPES[type.toUpperCase()])
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'summary',JSON.stringify(Object.keys(SUMMARY_TYPES)));summarytype=type.toUpperCase();}
else
{summarytype=null;}},enumerable:true,configurable:false});Object.defineProperty(this,'formula',{get:function()
{return formula;},set:function(sformula)
{formula=sformula;},enumerable:true,configurable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{name:_name,join:_join,operator:_operator,values:_values,formula:formula,summarytype:summarytype,isor:isor,isnot:isnot,leftparens:leftparens,rightparens:rightparens};}}
Filter.prototype=nsobject.getNewInstance();Filter.parseFilterExpression=function(filterExpression,callback)
{if(applyValidationFunctionToArrayElement(filterExpression,Filter.isFilterObject))
{if(callback)
{callback(filterExpression);return;}
else
{return filterExpression;}}
checkFilterExpression(filterExpression,'filters');var marshaled=Filter.marshalFiltersOrExpression(filterExpression);if(!callback)
{var javaResult=invoker(remoteApi,'parseSearchFilterExpression',[marshaled]);return filterCallback(javaResult);}
else
{invoker(remoteApi,'parseSearchFilterExpression',[marshaled],filterCallback)}
function filterCallback(javaResult)
{var nativeResult=invoker(remoteApi,'transform',[javaResult]);var result=[];for(var i=0;nativeResult&&i<nativeResult.length;i++)
{result.push(Filter.unmarshalFilter(nativeResult[i]));}
if(callback)
callback(result);else
return result;}};Filter.marshalFiltersOrExpression=function(filtersOrExpression)
{if(typeof filtersOrExpression==='undefined'||filtersOrExpression===null)
return null;utilityFunctions.assertTrue(util.isArray(filtersOrExpression),error.Type.WRONG_PARAMETER_TYPE,filtersOrExpression,'Array');return utilityFunctions.arrayToMap(filtersOrExpression,function(elem)
{if(Filter.isFilterObject(elem))
return elem._marshal();var container={javaClass:"java.util.HashMap"};if(util.isArray(elem))
container.arrayValue=Filter.marshalFiltersOrExpression(elem);else
container.stringValue=elem;return container;});};Filter.isFilterObject=function(obj)
{return(obj instanceof Filter)||util.isObject(obj);};Filter.marshalFilters=function(filters)
{filters=utilityFunctions.getAsArray(filters);utilityFunctions.assertArrayElementsOfSameType(filters,Filter,'filters');var rawFilters=[];for(var i=0;filters&&i<filters.length;i++)
{rawFilters.push(filters[i]._marshal());}
return rawFilters;};Filter.unmarshalFilterExpression=function(mapArrayPayload)
{return utilityFunctions.arrayToMap(mapArrayPayload,function(map)
{if(map.arrayValue!=null)
return Filter.unmarshalFilterExpression(map.arrayValue);if(map.stringValue!=null)
return map.stringValue;return Filter.unmarshalFilter(map);});};Filter.unmarshalFilter=function(filterJSON)
{var filter=new Filter(filterJSON.name,filterJSON.join,filterJSON.operator,filterJSON.values);filter._unmarshal(filterJSON);return filter;};Filter.normalizeFilters=function(filters)
{return(Filter.isFilterObject(filters)||isFilterExpressionArray(filters))?[filters]:(!filters?null:filters);};function checkFilterExpression(array,name)
{utilityFunctions.assertTrue(!array||applyValidationFunctionToArrayElement(array,isFilterExpTerm),error.Type.WRONG_PARAMETER_TYPE,name,'Array');}
function isFilterExpTerm(obj)
{if(typeof obj==='undefined'||!obj)
return false;if(util.isString(obj))
return /not|and|or/i.test(obj);if(isFilterExpressionArray(obj))
return true;return applyValidationFunctionToArrayElement(obj,isFilterExpTerm);}
function isFilterExpressionArray(array)
{return util.isArray(array)&&array.length>=3&&util.isString(array[0])&&util.isString(array[1])&&!/^not$/i.test(array[0]);}
function Setting(name,value)
{var TYPE='search.Setting';utilityFunctions.checkArgs([name,value],['name','value'],'search.Setting');var _name=name;var _value=value;this._clone=function _clone()
{var clone=new Setting(_name,_value);clone._unmarshal(this._marshal());return clone;};this._marshal=function _marshal()
{var settingObject={};settingObject.name=_name;settingObject.value=_value;return settingObject;};Object.defineProperty(this,'name',{get:function()
{return _name;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false});Object.defineProperty(this,'value',{get:function()
{return _value;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'value');},enumerable:true,configurable:false});this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{name:_name,value:_value};}
this._unmarshal=function _unmarshal(settingJSON)
{_value=settingJSON.value;};}
Setting.prototype=nsobject.getNewInstance();Setting.marshalSettings=function marshalSettings(settings)
{settings=utilityFunctions.getAsArray(settings);utilityFunctions.assertArrayElementsOfSameType(settings,Setting,'settings');var rawSettings=[];for(var i=0;settings&&i<settings.length;i++)
{rawSettings.push(settings[i]._marshal());}
return rawSettings;};Setting.unmarshalSetting=function unmarshalSetting(settingJSON)
{var opt=new Setting(settingJSON.name,settingJSON.value);return opt;};function Column(name,join,summary)
{var TYPE='search.Column';utilityFunctions.checkArgs([name],['name'],'search.Column');if(summary!=null&&(!util.isString(summary)||!SUMMARY_TYPES[summary.toUpperCase()]))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'summary',Object.keys(SUMMARY_TYPES));var that=this;var type=null;var label=null;var functionid=null;var formula=null;var sortdir=SORT.NONE;var index=-1;var userindex=-1;var whenorderedby=null;var whenorderedbyjoin=null;Object.defineProperty(this,'name',{get:function()
{return name;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false});Object.defineProperty(this,'join',{get:function()
{return join;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'join');},enumerable:true,configurable:false});Object.defineProperty(this,'summary',{get:function()
{return summary!=null?summary.toUpperCase():null;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'summary');},enumerable:true,configurable:false});Object.defineProperty(this,'formula',{get:function()
{return formula;},set:function(sformula)
{formula=sformula;},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function()
{return label;},set:function(slabel)
{label=slabel;},enumerable:true,configurable:false});Object.defineProperty(this,'function',{get:function()
{return functionid==null?'none':functionid;},set:function(sfunctionid)
{if(sfunctionid==='none'||sfunctionid===null)
functionid=null;else
{utilityFunctions.assertTrue(sfunctionid&&FUNCTIONS[sfunctionid]!=null,error.Type.WRONG_PARAMETER_TYPE,sfunctionid,Object.keys(FUNCTIONS));functionid=sfunctionid;}},enumerable:true,configurable:false});Object.defineProperty(this,'sort',{get:function()
{return sortdir;},set:function(direction)
{utilityFunctions.assertTrue(direction&&SORT[direction],error.Type.WRONG_PARAMETER_TYPE,direction,Object.keys(SORT));sortdir=SORT[direction];},enumerable:true,configurable:false});this.setWhenOrderedBy=function setWhenOrderedBy(options)
{var name=null,join=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('join')))
{name=options.name;join=options.join;}
else
{name=options;join=arguments[1];}
utilityFunctions.checkArgs([name,join],['name','join'],'Column.setWhenOrderedBy');whenorderedby=name;whenorderedbyjoin=join;return that;};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{name:name,join:join,summary:summary,label:label,type:type,'function':functionid,formula:formula,sortdir:sortdir,whenorderedby:whenorderedby,whenorderedbyjoin:whenorderedbyjoin};};this._setType=function _setType(sType){type=sType;};this._getIndex=function _getIndex(){return index};this._setIndex=function _setIndex(nIndex)
{index=nIndex;return that;};this._setUserIndex=function _setUserIndex(nUserIndex)
{userindex=nUserIndex;return that;};this._clone=function _clone()
{var clone=new Column(name,join,summary);clone._unmarshal(this._marshal());clone._setIndex(index);clone._setUserIndex(userindex);return clone;};this._unmarshal=function _unmarshal(columnJSON)
{label=columnJSON.label;type=columnJSON.type;functionid=columnJSON.functionid;formula=columnJSON.formula;sortdir=columnJSON.sortdir?columnJSON.sortdir:SORT.NONE;whenorderedby=columnJSON.whenorderedby;whenorderedbyjoin=columnJSON.whenorderedbyjoin;return that;};this._marshal=function _marshal()
{return{name:name,join:join,summary:summary,label:label,type:type,functionid:functionid,formula:formula,sortdir:sortdir===SORT.NONE?null:sortdir,index:index,userindex:userindex,whenorderedby:whenorderedby,whenorderedbyjoin:whenorderedbyjoin};};}
Column.prototype=nsobject.getNewInstance();Column.marshalColumns=function marshalColumns(columns)
{columns=utilityFunctions.getAsArray(columns);utilityFunctions.assertArrayElementsOfSameType(columns,Column,'columns');var rawColumns=[];for(var i=0;columns&&i<columns.length;i++)
{columns[i]._setUserIndex(i+1);rawColumns.push(columns[i]._marshal());}
return rawColumns;};Column.unmarshalColumn=function unmarshalColumn(columnJSON)
{var col=new Column(columnJSON.name,columnJSON.join,columnJSON.summary);return col._unmarshal(columnJSON);};function getNameFromColumn(column)
{return column.indexOf('.')!==-1?column.substring(column.indexOf('.')+1):column;}
function getJoinFromColumn(column)
{return column.indexOf('.')!==-1?column.substring(0,column.indexOf('.')):null;}
function ResultSet(searchObject)
{var TYPE='search.ResultSet';var search=searchObject;var FOR_EACH_RESULT_MAX_ROWS=4000;var FOR_EACH_RESULT_MAX_ROWS_ERR_MSG='No more than '+FOR_EACH_RESULT_MAX_ROWS+' search results may be returned at one time from ResultSet.each(). Please revise your search criteria or modify the callback logic so that no more than '+FOR_EACH_RESULT_MAX_ROWS+' results are returned.';Object.defineProperty(this,'columns',{get:function()
{return search.columns;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columns');},enumerable:true,configurable:false});Object.defineProperty(this,'_getResultset',{get:function()
{var start=0,end=1000;var rawFilters=Filter.marshalFilters(search.filters);var rawColumns=Column.marshalColumns(search.columns);var rawSettings=Setting.marshalSettings(search.settings);var javaResults=invoker(searchApi,'nlapiSearchRange',[search.searchType,search.id,rawFilters,rawColumns,rawSettings,start,end]);return javaResults;},enumerable:false,configurable:false});function getRange_postProcess(javaResults)
{var rawResults=invoker(remoteApi,'transform',[javaResults]);return Result.extractResults(rawResults,search.columns,javaResults);}
this.getRange=function getRange()
{var start=null,end=null;if(arguments[0]&&(arguments[0].hasOwnProperty('start')||arguments[0].hasOwnProperty('end')))
{start=arguments[0].start;end=arguments[0].end;}
else
{start=arguments[0];end=arguments[1];}
utilityFunctions.checkArgs([start,end],['start','end'],'ResultSet.getRange');utilityFunctions.assertTrue(start>=0,error.Type.SSS_INVALID_SEARCH_RESULT_INDEX);utilityFunctions.assertTrue((end-start)<=1000,error.Type.SSS_SEARCH_RESULT_LIMIT_EXCEEDED);if(start>=end)
return[];var rawFilters=Filter.marshalFilters(search.filters);var rawColumns=Column.marshalColumns(search.columns);var rawSettings=Setting.marshalSettings(search.settings);var javaResults=invoker(searchApi,'nlapiSearchRange',[search.searchType,search.id,rawFilters,rawColumns,rawSettings,start,end]);return getRange_postProcess(javaResults);};this.getRange.promise=function()
{var args=arguments;var myPromise=new Promise(function(resolve,reject)
{try
{var start=null,end=null;if(args[0]&&(args[0].hasOwnProperty('start')||args[0].hasOwnProperty('end')))
{start=args[0].start;end=args[0].end;}
else
{start=args[0];end=args[1];}
utilityFunctions.checkArgs([start,end],['start','end'],'ResultSet.getRange');utilityFunctions.assertTrue(start>=0,error.Type.SSS_INVALID_SEARCH_RESULT_INDEX);utilityFunctions.assertTrue((end-start)<=1000,error.Type.SSS_SEARCH_RESULT_LIMIT_EXCEEDED);if(start>=end)
resolve([]);var rawFilters=Filter.marshalFilters(search.filters);var rawColumns=Column.marshalColumns(search.columns);var rawSettings=Setting.marshalSettings(search.settings);invoker(searchApi,'nlapiSearchRange',[search.searchType,search.id,rawFilters,rawColumns,rawSettings,start,end],callback);}
catch(e)
{reject(e);}
function callback(result,exception)
{if(exception)
{reject(exception)}
else
{try
{resolve(getRange_postProcess(result));}
catch(e)
{reject(e);}}}});return myPromise}
this.each=function each(callback)
{var remoteId=null;var rawFilters=Filter.marshalFilters(search.filters);var rawColumns=Column.marshalColumns(search.columns);var rawSettings=Setting.marshalSettings(search.settings);var returnedRowCount=0;var PAGE_SIZE=500;var continueIteration=true;var start=0;try
{while(continueIteration)
{var javaResults=invoker(searchApi,'nlapiContinueSearch',[search.searchType,search.id,rawFilters,rawColumns,rawSettings,remoteId,start,start+PAGE_SIZE]);var rawResults=invoker(remoteApi,'transform',[javaResults]);var searchResults=Result.extractResults(rawResults,search.columns);if(searchResults==null||searchResults.length==0)
break;for(var i=0;continueIteration&&i<searchResults.length;i++)
{utilityFunctions.assertTrue(returnedRowCount<FOR_EACH_RESULT_MAX_ROWS,error.Type.SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED,FOR_EACH_RESULT_MAX_ROWS);continueIteration=callback(searchResults[i]);returnedRowCount++;}
if(!remoteId)
remoteId=rawResults[0].remoteid;if(searchResults.length<PAGE_SIZE)
break;start+=PAGE_SIZE;}}
finally
{invoker(searchApi,'nlapiEndSearch',[remoteId]);}};this.each.promise=function promise(callback)
{var remoteId=null;var rawFilters=Filter.marshalFilters(search.filters);var rawColumns=Column.marshalColumns(search.columns);var rawSettings=Setting.marshalSettings(search.settings);var returnedRowCount=0;var PAGE_SIZE=500;var continueIteration=true;var start=0;var myPromise=new Promise(function(resolve,reject)
{var loop=function()
{return new Promise(function(resolveInner,rejectInner)
{invoker(searchApi,'nlapiContinueSearch',[search.searchType,search.id,rawFilters,rawColumns,rawSettings,remoteId,start,start+PAGE_SIZE],resolveInner);}).then(function(result)
{var rawResults=invoker(remoteApi,'transform',[result]);var searchResults=Result.extractResults(rawResults,search.columns);if(searchResults==null||searchResults.length==0)
{resolve(true);return false;}
for(var i=0;continueIteration&&i<searchResults.length;i++)
{utilityFunctions.assertTrue(returnedRowCount<FOR_EACH_RESULT_MAX_ROWS,error.Type.SSS_SEARCH_FOR_EACH_LIMIT_EXCEEDED,FOR_EACH_RESULT_MAX_ROWS);continueIteration=callback(searchResults[i]);returnedRowCount++;}
if(!remoteId)
remoteId=rawResults[0].remoteid;if(searchResults.length<PAGE_SIZE)
{resolve(true);return false;}
start+=PAGE_SIZE;return true;}).then(function(keepGoing){if(keepGoing)loop()}).then(undefined,function(reason){reject(reason)});};loop().then(function(){invoker(searchApi,'nlapiEndSearch',[remoteId])});});return myPromise}
this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{columns:search.columns};}}
ResultSet.prototype=nsobject.getNewInstance();function Result(type,id,rawValues,rawColumns,javaResult)
{var TYPE='search.Result';var valuesByKey={};var valuesByKeyMapPopulated=false;function getCellAttribute(nameOrColumn,join,summary,func,attribute)
{var cell=null;if(util.isString(nameOrColumn))
{var name=nameOrColumn
populateValueByKeyMap();cell=valuesByKey[getKey(name,join,summary,undefined,func)];}
else if(nameOrColumn instanceof Column)
{var column=nameOrColumn;if(column._getIndex()!==-1)
cell=rawValues[column._getIndex()-1];if(!cell)
{populateValueByKeyMap();cell=valuesByKey[getKey(column.name,column.join,column.summary,column.formula)]}}
return(cell!=null&&cell[attribute]!=null)?cell[attribute]:null;}
function getKey(name,join,summary,formula,func)
{return(join?join.toLowerCase()+'_':'')
+name.toLowerCase()
+(summary?'_'+summary.toLowerCase():'')
+(formula?'_'+formula.toLowerCase():'')
+(func&&func!=='none'?'_'+func.toLowerCase():'');}
function populateValueByKeyMap()
{if(!valuesByKeyMapPopulated)
{for(var i=0;rawValues!=null&&i<rawValues.length;i++)
{var name=rawColumns[i]['name'];var join=rawColumns[i]['join'];var summary=rawColumns[i]['summary'];var formula=rawColumns[i]['formula'];var func=rawColumns[i]['function'];var key;key=getKey(name,join,summary,formula,func);valuesByKey[key]=rawValues[i];key=getKey(name,join,summary,formula,null);if(valuesByKey[key]===undefined)
valuesByKey[key]=rawValues[i];if(func)
{key=getKey(name,join,summary,null,func);valuesByKey[key]=rawValues[i];key=getKey(name,join,summary,null,null);if(valuesByKey[key]===undefined)
valuesByKey[key]=rawValues[i];}}
valuesByKeyMapPopulated=true;}}
Object.defineProperty(this,'recordType',{get:function()
{return type;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'recordType');},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function()
{return id;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'id');},enumerable:true,configurable:false});Object.defineProperty(this,'columns',{get:function()
{return rawColumns;},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columns');},enumerable:true,configurable:false});Object.defineProperty(this,'_saveToTemplateRenderer',{get:function()
{return javaResult;},set:function(val)
{return;},enumerable:false,configurable:false});this.getValue=function getValue(options)
{var name,join,summary,func;if(!!options&&!util.isString(options))
{name=options.name;join=options.join;summary=options.summary;func=options.func||options['function'];}
else
{name=options;}
if(options instanceof Column)
{name=options;join=undefined;summary=undefined;func=undefined;}
utilityFunctions.checkArgs([name],['name'],'Result.getValue');return getCellAttribute(name,join!=null?join:null,summary!=null?summary:null,func!=null?func:null,'value');};this.getText=function getText(options)
{var name,join,summary,func;if(!!options&&!util.isString(options))
{name=options.name;join=options.join;summary=options.summary;func=options.func;}
else
{name=options;}
if(options instanceof Column)
{name=options;join=undefined;summary=undefined;func=undefined;}
utilityFunctions.checkArgs([name],['name'],'Result.getText');return getCellAttribute(name,join!=null?join:null,summary!=null?summary:null,func!=null?func:null,'text');};this.toString=function toString()
{return TYPE;};this.toJSON=function toJSON()
{return{recordType:type,id:id,values:this.getAllValues()};};this.getAllValues=function getAllValues()
{var names={};function disabiguateName(name)
{var retVal=name;if(names[name])
{var postFix=names[name];names[name]++;retVal=retVal+"_"+postFix;}
else
{names[name]=1;}
return retVal;}
var results={};var name=null;var join=null;var sum=null;var func=null;for(var i=0;rawColumns&&i<rawColumns.length;i++)
{name=rawColumns[i].name;join=rawColumns[i].join;sum=rawColumns[i].summary;func=rawColumns[i]['function'];var nameJoin=(join?join+'.':'')+name;if(sum)
nameJoin=sum+'('+nameJoin+')';var isrectype=name.toLowerCase()==='recordtype';var param=(util.isString(name)&&name.length>=7&&name.substr(0,7)==="formula")?rawColumns[i]:{name:name,join:join,summary:sum,func:func};var txt=isrectype?null:this.getText(param);var val=isrectype?type:this.getValue(param);nameJoin=disabiguateName(nameJoin)
if(txt!==null&&val!==null&&txt!==undefined&&val!==undefined)
{if(txt.length===0&&val.length===0)
{results[nameJoin]=[];}
else
{var multival=val.split(',');var multitxt=txt.split(",");if(multival.length===1)
{val=[];val.push({value:multival[0],text:txt});results[nameJoin]=val;}
else if(multival.length===multitxt.length)
{val=[];for(j=0;j<multival.length;j++)
{val.push({value:multival[j],text:multitxt[j]});}
results[nameJoin]=val;}
else
{results[nameJoin]={value:val,text:txt};}}}
else
{results[nameJoin]=val;}}
return results;};}
Result.prototype=nsobject.getNewInstance();Result.extractResults=function extractResults(rawResults,columns,javaResults)
{var rows=[];if(rawResults!=null&&rawResults.length>0)
{var recordTypeColumn=null;var columnArray=utilityFunctions.getAsArray(columns)
if(columnArray!=null)
recordTypeColumn=columnArray.filter(function(el){return el.name==="recordtype";})[0];columns=rawResults[0].columns;for(var i=0;columns!=null&&i<columns.length;i++)
{var obj=null;var col=columns[i];if(col.userindex==-1)
{obj=Column.unmarshalColumn(col);}
else if(columnArray!=null)
{obj=columnArray[col.userindex-1];}
obj._setIndex(col.index);obj._setType(col.type);columns[i]=obj;}
if(!!recordTypeColumn)
{if(util.isArray(columns))
{if(columns.filter(function(el){return el.name==="recordtype";}).length===0)
columns.push(recordTypeColumn);}
else
columns=[recordTypeColumn];}
for(i=0;i<rawResults.length;i++)
{rows[rows.length]=new Result(rawResults[i].recordType,rawResults[i].id,rawResults[i].cells,columns,(javaResults&&javaResults[i])?javaResults[i]:null)}}
return rows;};function SearchPageRange(options)
{var that=this;var delegate;if(options)
{delegate=options.delegate;}
utilityFunctions.checkArgs([delegate],['delegate'],'PageRange');function getIndex()
{return invoker(delegate,'getIndex');}
function getCompoundKey()
{return invoker(delegate,'getCompoundKey');}
function getCompoundLabel()
{return invoker(delegate,'getCompoundLabel');}
this.getIndex=getIndex;this.getCompoundKey=getCompoundKey;this.getCompoundLabel=getCompoundLabel;}
SearchPageRange.prototype=nsobject.getNewInstance();function SearchPage(options)
{var that=this;var delegate;var pagedData;var pageIndex;var data;if(options)
{delegate=options.delegate;pagedData=options.pagedData;pageIndex=options.pageIndex;}
utilityFunctions.checkArgs([delegate,pagedData,pageIndex],['delegate','pagedData','pageIndex'],'Page');Object.defineProperty(this,'pagedData',{configurable:false,enumerable:true,get:function()
{return pagedData;}});Object.defineProperty(this,'pageRange',{configurable:false,enumerable:true,get:function()
{return pagedData.pageRanges[pageIndex];}});Object.defineProperty(this,'data',{configurable:false,enumerable:true,get:function()
{var javaResults,rawResults;if(!data){javaResults=invoker(delegate,'getData');rawResults=invoker(remoteApi,'transform',[javaResults]);data=Result.extractResults(rawResults,pagedData.searchDefinition.columns,javaResults);}
return data;}});Object.defineProperty(this,'isFirst',{configurable:false,enumerable:true,get:function()
{return invoker(delegate,'isFirst');}});Object.defineProperty(this,'isLast',{configurable:false,enumerable:true,get:function()
{return invoker(delegate,'isLast');}});this.next=function next(){var result;if(that.isLast)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'next');}
else
{result=pagedData.fetch(pagedData.pageRanges[pageIndex+1].getIndex());}
return result;};this.prev=function prev(){var result;if(that.isFirst)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'prev');}
else
{result=pagedData.fetch(pagedData.pageRanges[pageIndex-1].getIndex());}
return result;};this.next.promise=function nextPromise()
{var result;if(that.isLast)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: next.promise.',notifyOff:false}));}
else
{result=pagedData.fetch.promise(pagedData.pageRanges[pageIndex+1].getIndex());}
return result;};this.prev.promise=function prevPromise()
{var result;if(that.isFirst)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: prev.promise.',notifyOff:false}));}
else
{result=pagedData.fetch.promise(pagedData.pageRanges[pageIndex-1].getIndex());}
return result;};}
SearchPage.prototype=nsobject.getNewInstance();function ReadonlySearch(delegate)
{function cloneArrayOfFiltersOrColumnsOrSettings(o)
{var toRet=[];if(o&&util.isArray(o))
{o.forEach(function(obj){if(obj instanceof Filter||obj instanceof Column||obj instanceof Setting)
toRet.push(utilityFunctions.freezeObjectIfPossible(obj._clone()));})}
return utilityFunctions.freezeObjectIfPossible(toRet)}
Object.defineProperty(this,'searchType',{get:function(){return delegate.searchType;},enumerable:true,configurable:false});Object.defineProperty(this,'searchId',{get:function(){return delegate.searchId;},enumerable:true,configurable:false});Object.defineProperty(this,'title',{get:function(){return delegate.title},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function(){return delegate.id;},enumerable:true,configurable:false});Object.defineProperty(this,'isPublic',{get:function(){return delegate.isPublic;},enumerable:true,configurable:false});Object.defineProperty(this,'columns',{get:function(){return cloneArrayOfFiltersOrColumnsOrSettings(delegate.columns);},enumerable:true,configurable:false});Object.defineProperty(this,'filters',{get:function(){return cloneArrayOfFiltersOrColumnsOrSettings(delegate.filters);},enumerable:true,configurable:false});Object.defineProperty(this,'settings',{get:function(){return cloneArrayOfFiltersOrColumnsOrSettings(delegate.settings);},enumerable:true,configurable:false});this.toJSON=delegate.toJSON;this.toString=function(){return delegate.toString()+"(readonly)";}}
ReadonlySearch.prototype=nsobject.getNewInstance();function SearchPagedData(options)
{var that=this;var delegate,searchDefinition;var pageRanges=null;if(options)
{delegate=options.delegate;searchDefinition=options.searchDefinition;}
utilityFunctions.checkArgs([delegate,searchDefinition],['delegate','searchDefinition'],'PagedData');function getPage(index)
{if(index<0||index>=that.pageRanges.length)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'fetch');}
var page=new SearchPage({delegate:invoker(delegate,'getPage',resolveUndefinedForArguments([index])),pagedData:that,pageIndex:index});return new paginationObject.Page(page);}
function getPagePromise(index)
{var result;if(index<0||index>=that.pageRanges.length)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: fetch.promise.',notifyOff:false}));}
else
{result=invoker(delegate,'getPagePromise',resolveUndefinedForArguments([index])).then(function(value){var page=new SearchPage({delegate:value,pagedData:that,pageIndex:index});return new paginationObject.Page(page)});}
return result;}
Object.defineProperty(this,'pageSize',{configurable:false,enumerable:true,get:function()
{return invoker(delegate,'getPageSize');}});Object.defineProperty(this,'count',{configurable:false,enumerable:true,get:function()
{return invoker(delegate,'getTotalRows');}});Object.defineProperty(this,'pageRanges',{configurable:false,enumerable:true,get:function()
{if(!pageRanges){pageRanges=invoker(delegate,'getPageRanges').map(function(v,i,a){return new SearchPageRange({delegate:v});});}
return pageRanges;}});this.searchDefinition=new ReadonlySearch(searchDefinition);this.fetch=getPage;this.fetch.promise=getPagePromise;}
SearchPagedData.prototype=nsobject.getNewInstance();function createSearch(type,searchId,filters,columns,settings){return new Search(type,searchId,filters,columns,settings);}
function createFilter(options){var name=null,join=null,operator=null,values=null;var isOpts=false;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('join')||options.hasOwnProperty('operator')||options.hasOwnProperty('values')))
{name=options.name;join=options.join;operator=options.operator;values=options.values;isOpts=true;}
else
{name=options;join=arguments[1];operator=arguments[2];values=arguments[3];}
utilityFunctions.checkArgs([name,operator],['name','operator'],'search.createFilter');var filter=new Filter(name,join,operator,values);if(isOpts)
{if(options.formula)
filter.formula=options.formula;if(options.summary)
filter.summary=options.summary;}
return filter;}
function createSetting(options){var name=null,value=null;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('value')))
{name=options.name;value=options.value;}
else
{name=options;value=arguments[1];}
utilityFunctions.checkArgs([name,value],['name','value'],'search.createSetting');var setting=new Setting(name,value);return setting;}
function createColumn(options){var name=null,join=null,summary=null;var isOpts=false;if(options&&(options.hasOwnProperty('name')||options.hasOwnProperty('join')||options.hasOwnProperty('summary')))
{name=options.name;join=options.join;summary=options.summary;isOpts=true;}
else
{name=options;join=arguments[1];summary=arguments[2];}
utilityFunctions.checkArgs([name],['name'],'search.createColumn');var column=new Column(name,join?join:null,summary?summary:null);if(isOpts)
{if(options.formula)
column.formula=options.formula;if(options.func)
column['function']=options.func;else if(options['function'])
column['function']=options['function'];if(options.label)
column.label=options.label;if(options.sort!==undefined)
column.sort=options.sort;}
return column;}
return{createSearch:createSearch,createFilter:createFilter,createSetting:createSetting,createColumn:createColumn,Filter:Filter,Column:Column,Setting:Setting,Result:Result,SUMMARY_TYPES:SUMMARY_TYPES,OPERATORS:OPERATORS,SORT:SORT,util:{getNameFromColumn:getNameFromColumn,getJoinFromColumn:getJoinFromColumn}}});define('N/search/searchUtil',['N/restricted/searchApi','N/restricted/remoteApiBridge','N/error','N/restricted/invoker','N/search/searchObject','N/utilityFunctions','N/creationFunctionWrapper'],function(searchApi,remoteApi,error,invoker,searchObject,utilityFunctions,funcWrapper)
{var Filter=searchObject.Filter;var Column=searchObject.Column;var Setting=searchObject.Setting;var Result=searchObject.Result;var searchUtilityFunctions=searchObject.util;function validateAndParseFilterExpression(options,callback)
{var type=null,filters=null;if(options)
{type=options.type;filters=options.filters;}
utilityFunctions.checkArgs([type],['type'],'search.create');invoker(searchApi,'assertValidSearchType',[type]);return parseFilterExpression(filters,callback);}
function parseFilterExpression(filters,callback)
{filters=Filter.normalizeFilters(filters);return Filter.parseFilterExpression(filters,callback);}
function doCreateSearch(options)
{var columns=options.columns!=null?options.columns:null;var settings=options.settings||null;var result=searchObject.createSearch(options.type,-1,options.filters,columns,settings);if(options.title)
result.title=options.title;if(options.id)
result.id=options.id;return result;}
function doLoad(options,callback)
{var id=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([id],['id'],'search.load');var type=(options&&options.hasOwnProperty('type'))?options.type:null;if(!!type)
invoker(searchApi,'assertValidSearchType',[type]);var search=searchObject.createSearch(type,id,null,null);search._load(callback);return search;}
function doDelete(options,callback)
{var id=(options&&options.hasOwnProperty('id'))?options.id:options;utilityFunctions.checkArgs([id],['id'],'search.delete');invoker(searchApi,'nlapiDeleteSearch',[id],callback);}
function doSearchRecord(options,callback)
{var search=doCreateSearch(options);var filters=Filter.marshalFilters(search.filters);var columns=Column.marshalColumns(search.columns);var settings=Setting.marshalSettings(search.settings);return invoker(searchApi,'nlapiSearchRecord',[search.searchType,search.id,filters,columns,settings],callback);}
function doSearchRecord_postProcess(javaResults)
{var rawResults=invoker(remoteApi,'transform',[javaResults]);var columns=null;if(rawResults&&rawResults.length>0&&rawResults[0].columns)
columns=rawResults[0].columns.map(Column.unmarshalColumn);var results=Result.extractResults(rawResults,columns);return results?results:[];}
function doSearchDuplicates(options,callback)
{var type=null,fields=null,id=0;if(options)
{type=options.type;fields=options.fields||null;id=options.id||0;}
utilityFunctions.checkArgs([type],['type'],'search.duplicates');var javaResults=invoker(searchApi,'nlapiSearchDuplicate',[type,fields,id],callback);if(!callback)
{var rawResults=invoker(remoteApi,'transform',[javaResults]);return rawResults;}}
function doSearchDuplicates_postProcess(rawResults)
{var searchResults=Result.extractResults(rawResults,null);return searchResults?searchResults:[];}
function doSearchGlobal(options,callback)
{var keywords=(options&&options.hasOwnProperty('keywords'))?options.keywords:options;utilityFunctions.checkArgs([keywords],['keywords'],'search.global');return invoker(searchApi,'nlapiSearchGlobal',[keywords],callback);}
function doSearchGlobal_postProcess(javaResults)
{var rawResults=invoker(remoteApi,'transform',[javaResults]);var searchResults=Result.extractResults(rawResults,null);return searchResults?searchResults:[];}
function getLookupArgs(options)
{var type=null,id=null,columns=null;if(options)
{type=options.type;id=options.id;columns=utilityFunctions.getAsArray(options.columns);}
utilityFunctions.checkArgs([type,id,columns],['type','id','columns'],'search.lookupFields');return{type:type,id:id,columns:columns};}
function getLookupSearchColumns(columns)
{var searchColumns=[];for(var i=0;i<columns.length;i++)
if(util.isString(columns[i])&&columns[i].toLowerCase()!=='recordtype')
searchColumns[searchColumns.length]=searchObject.createColumn(searchUtilityFunctions.getNameFromColumn(columns[i]),searchUtilityFunctions.getJoinFromColumn(columns[i]),null);return searchColumns;}
function getPostProcessColumns(searchColumns,asksRecordType)
{if(asksRecordType)
searchColumns[searchColumns.length]=searchObject.createColumn("recordtype",null,null);return searchColumns;}
function doLookupFields(argObj,searchColumns,callback)
{argObj.columns=Column.marshalColumns(searchColumns);return invoker(searchApi,'nlapiLookupFields',[argObj.type,argObj.id,argObj.columns],callback);}
function doLookupFields_postProcess(javaResults,searchColumns)
{var rawResults=invoker(remoteApi,'transform',[javaResults]);var searchResult=Result.extractResults(rawResults,searchColumns);if(searchResult&&searchResult.length>0)
return searchResult[0].getAllValues();return{};}
return{validateAndParseFilterExpression:validateAndParseFilterExpression,parseFilterExpression:parseFilterExpression,doCreateSearch:funcWrapper.wrap(doCreateSearch),doLoad:doLoad,doDelete:doDelete,doSearchRecord:doSearchRecord,doSearchRecord_postProcess:doSearchRecord_postProcess,doSearchDuplicates:doSearchDuplicates,doSearchDuplicates_postProcess:doSearchDuplicates_postProcess,doSearchGlobal:doSearchGlobal,doSearchGlobal_postProcess:doSearchGlobal_postProcess,getLookupArgs:getLookupArgs,getLookupSearchColumns:getLookupSearchColumns,getPostProcessColumns:getPostProcessColumns,doLookupFields:doLookupFields,doLookupFields_postProcess:doLookupFields_postProcess,createColumn:funcWrapper.wrap(searchObject.createColumn),createFilter:funcWrapper.wrap(searchObject.createFilter),createSetting:funcWrapper.wrap(searchObject.createSetting),OPERATORS:searchObject.OPERATORS,SUMMARY_TYPES:searchObject.SUMMARY_TYPES,SORT:searchObject.SORT}});define('N/search',['N/search/searchUtil','N/restricted/searchApi','N/restricted/invoker'],function(searchUtil,api,invoker)
{function createSearch(options)
{var parsedFilters=searchUtil.validateAndParseFilterExpression(options)
options.filters=parsedFilters;return searchUtil.doCreateSearch(options);}
createSearch.promise=function createSearchPromise(options)
{return new Promise(function(resolve,reject)
{try
{searchUtil.validateAndParseFilterExpression(options,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{options.filters=result;resolve(searchUtil.doCreateSearch(options));}
catch(e)
{reject(e);}}});};function loadSearch(options)
{return searchUtil.doLoad(options);}
loadSearch.promise=function loadSearchPromise(options)
{return new Promise(function(resolve,reject)
{try
{searchUtil.doLoad(options,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve(result);}
catch(e)
{reject(e);}}});};function deleteSearch(options)
{return searchUtil.doDelete(options);}
deleteSearch.promise=function deleteSearchPromise(options)
{return new Promise(function(resolve,reject)
{try
{searchUtil.doDelete(options,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve();}
catch(e)
{reject(e);}}});};function searchDuplicates(options)
{var rawResults=searchUtil.doSearchDuplicates(options);return searchUtil.doSearchDuplicates_postProcess(rawResults);}
searchDuplicates.promise=function searchDuplicatesPromise(options)
{return new Promise(function(resolve,reject)
{try
{searchUtil.doSearchDuplicates(options,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve(searchUtil.doSearchDuplicates_postProcess(result));}
catch(e)
{reject(e);}}});};function searchGlobal(options)
{var rawResults=searchUtil.doSearchGlobal(options);return searchUtil.doSearchGlobal_postProcess(rawResults);}
searchGlobal.promise=function searchGlobalPromise(options)
{return new Promise(function(resolve,reject)
{try
{searchUtil.doSearchGlobal(options,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve(searchUtil.doSearchGlobal_postProcess(result));}
catch(e)
{reject(e);}}});};function lookupFields(options)
{var lookupArgs=searchUtil.getLookupArgs(options);var asksRecordType=lookupArgs.columns.indexOf('recordtype')>=0;var searchColumns=searchUtil.getLookupSearchColumns(lookupArgs.columns);var javaResults=searchUtil.doLookupFields(lookupArgs,searchColumns);if(options.v1call)
api.chargeUsage("nlapiLookupFields_v1",options.type);return searchUtil.doLookupFields_postProcess(javaResults,searchUtil.getPostProcessColumns(searchColumns,asksRecordType));}
lookupFields.promise=function lookupFieldsPromise(options)
{return new Promise(function(resolve,reject)
{try
{var lookupArgs=searchUtil.getLookupArgs(options);var searchColumns=searchUtil.getLookupSearchColumns(lookupArgs.columns);searchUtil.doLookupFields(lookupArgs,searchColumns,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve(searchUtil.doLookupFields_postProcess(result,searchColumns));}
catch(e)
{reject(e);}}});};return Object.freeze({create:createSearch,load:loadSearch,'delete':deleteSearch,duplicates:searchDuplicates,global:searchGlobal,lookupFields:lookupFields,createColumn:searchUtil.createColumn,createFilter:searchUtil.createFilter,createSetting:searchUtil.createSetting,Operator:searchUtil.OPERATORS,Summary:searchUtil.SUMMARY_TYPES,Sort:searchUtil.SORT,get Type()
{if(!searchUtil.searchTypes)
searchUtil.searchTypes=invoker(api,'getSearchTypeEnumMap',[]);return searchUtil.searchTypes;}});});define('N/transaction/transactionUtil',['N/utilityFunctions'],function(utilityFunctions)
{function getVoidTransactionArgs(options,id)
{var type=options;if(utilityFunctions.isObject(options))
{type=options.type;id=options.id;}
utilityFunctions.checkArgs([type,id],['type','id'],'void');return[type,id];}
function doVoidTransaction(voidedId)
{return parseInt(voidedId,10);}
return{getVoidTransactionArgs:getVoidTransactionArgs,doVoidTransaction:doVoidTransaction}});define('N/restricted/transactionApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/transaction',['N/transaction/transactionUtil','N/restricted/transactionApi','N/restricted/invoker'],function(transactionUtil,transactionApi,invoker)
{function voidTransaction(options,id)
{var voidArgs=transactionUtil.getVoidTransactionArgs(options,id);var voidResult=invoker(transactionApi,"nlapiVoidTransaction",voidArgs);return transactionUtil.doVoidTransaction(voidResult);}
voidTransaction.promise=function voidTransactionPromise(options,id){return new Promise(function(resolve,reject)
{try
{var args=transactionUtil.getVoidTransactionArgs(options,id);invoker(transactionApi,"nlapiVoidTransaction",args,callback);}
catch(e)
{reject(e);}
function callback(result,exception){if(exception)
{reject(exception);return;}
try
{resolve(transactionUtil.doVoidTransaction(result));}
catch(e)
{reject(e);}}});};return Object.freeze({"void":voidTransaction,get Type()
{if(!transactionUtil.transactionTypes)
transactionUtil.transactionTypes=invoker(transactionApi,'getTransactionTypeEnumMap',[]);return transactionUtil.transactionTypes;}});});define('N/restricted/emailApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/email',['N/restricted/emailApi','N/restricted/invoker','N/utilityFunctions','N/error'],function(emailApi,invoker,utilityFunctions,error)
{function EmailObject(options)
{var files=[];this.doSendEmail=function doSendEmail(options,notifySenderOnBounce)
{var relatedRecords=new Object();var undef=undefined;utilityFunctions.checkArgs([options],['options'],'email.send');if(!utilityFunctions.isObject(options))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options','object');}
var author=options!==undef&&options!==null&&options.author!==undef?options.author:undef;var recipients=options!==undef&&options!==null&&options.recipients!==undef?options.recipients:undef;var body=options!==undef&&options!==null&&options.body!==undef?options.body:undef;var subject=options!==undef&&options!==null&&options.subject!==undef?options.subject:undef;utilityFunctions.checkArgs([author,recipients,body,subject],['options.author','options.recipients','options.body','options.subject'],'email.send');if(recipients instanceof Array)
{recipients=recipients.join();}
if(options.cc&&!(options.cc instanceof Array))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.cc','Array');}
if(options.bcc&&!(options.bcc instanceof Array))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.bcc','Array');}
if(options.isInternalOnly&&!util.isBoolean(options.isInternalOnly))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.isInternalOnly','boolean');}
if(options.replyTo&&!util.isString(options.replyTo))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.replyTo','string');}
if(options.attachments&&!(util.isArray(options.attachments)))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.attachments','Array');}
if(options.attachments)
{for(var index in options.attachments)
{var file=options.attachments[index];if(!file.hasOwnProperty('toString')||file.toString()!=='file.File')
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.attachments','file.File[]');}
file._attachToEmail=this;}}
if(options.relatedRecords&&!utilityFunctions.isObject(options.relatedRecords))
{utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,'options.relatedRecords','object');}
if(options.relatedRecords)
{if(options.relatedRecords.hasOwnProperty('transactionId'))
{relatedRecords['transaction']=options.relatedRecords.transactionId;}
if(options.relatedRecords.hasOwnProperty('activityId'))
{relatedRecords['activity']=options.relatedRecords.activityId;}
if(options.relatedRecords.hasOwnProperty('entityId'))
{relatedRecords['entity']=options.relatedRecords.entityId;}
if(options.relatedRecords.hasOwnProperty('customRecord')&&options.relatedRecords.customRecord)
{if(options.relatedRecords.customRecord.hasOwnProperty('id')&&options.relatedRecords.customRecord.hasOwnProperty('recordType'))
{relatedRecords['record']=options.relatedRecords.customRecord.id;relatedRecords['recordtype']=options.relatedRecords.customRecord.recordType;}}}
return invoker(emailApi,'nlapiSendEmail',[author,recipients,subject,body,options.cc||null,options.bcc||null,relatedRecords,files||null,notifySenderOnBounce,options.isInternalOnly||false,options.replyTo||null]);};this._attach=function(f)
{files.push(f);};Object.defineProperty(this,'_attach',{set:function(f)
{files.push(f);},enumerable:false,configurable:false,writeable:true});}
function doSendEmail(options,isNotBulk)
{var emailObject=new EmailObject(options);return emailObject.doSendEmail(options,isNotBulk);}
function doSendCampaignEventEmail(campaignEventId,recipientId)
{utilityFunctions.checkArgs([campaignEventId,recipientId],['campaignEventId','recipientId'],'email.sendCampaignEvent');return invoker(emailApi,'nlapiSendCampaignEmail',[campaignEventId,recipientId]);}
function craftPromise(resolveThis)
{return new Promise(function(resolve,reject)
{try
{resolve(resolveThis());}
catch(e)
{reject(e);}});}
function sendEmail(options)
{return doSendEmail(options,true);}
sendEmail.promise=function sendEmailPromise(options)
{var resolveThis=function callback(){return sendEmail(options);};return craftPromise(resolveThis);};function sendBulkEmail(options)
{return doSendEmail(options,false);}
sendBulkEmail.promise=function sendBulkEmailPromise(options)
{var resolveThis=function callback(){return sendBulkEmail(options)};return craftPromise(resolveThis);};function sendCampaignEventEmail(campaignEventId,recipientId)
{return doSendCampaignEventEmail(campaignEventId,recipientId);}
sendCampaignEventEmail.promise=function sendCampaignEventEmailPromise(campaignEventId,recipientId)
{var resolveThis=function callback(){return sendCampaignEventEmail(campaignEventId,recipientId);};return craftPromise(resolveThis);};return Object.freeze({send:sendEmail,sendBulk:sendBulkEmail,sendCampaignEvent:sendCampaignEventEmail});});define('N/restricted/msgRouterBridge',[],function(){var allQueuesContainer=[];var queueStack=[];function getMessageQueueImpl(queueId)
{return allQueuesContainer.find(function(msgQueueImpl){return(msgQueueImpl.id===queueId);})||null;}
function pushMsgQueue(messageQueueId)
{var activeQueue=getMessageQueueImpl(messageQueueId)||allQueuesContainer[0];queueStack.push(activeQueue);return queueStack.length;}
function popMsgQueue(threshold){var th=(threshold==null||threshold<1)?1:threshold;if(queueStack.length>th)
queueStack.splice(-1);return queueStack.length;}
function getActiveMsgQueue()
{return queueStack[queueStack.length-1]||null;}
function addToQueuesContainer(messageQueueImpl)
{var queueId=allQueuesContainer.length;allQueuesContainer.push(messageQueueImpl);if(queueStack.length===0)
queueStack.push(messageQueueImpl);return queueId;}
return Object.freeze({pushMsgQueue:pushMsgQueue,popMsgQueue:popMsgQueue,getActiveMsgQueue:getActiveMsgQueue,addToQueuesContainer:addToQueuesContainer});});define('N/msgRouter',['N/nsobject','N/utilityFunctions','N/restricted/remoteApiBridge','N/restricted/invoker','N/restricted/msgRouterBridge'],function(nsobject,utilityFunctions,remoteApi,invoker,msgRouterBridge)
{function isServerSide(){return typeof document==='undefined';}
function Message(options)
{var TYPE='Message';var msgInfo=options;this.toString=function()
{return TYPE;};this.toJSON=function()
{return msgInfo;};}
Object.freeze(Message);function MessageQueueImpl()
{var TYPE='msgRouter.MessageQueueImpl';var messageContainer=[];var messageService=new MessageService(this);var queueId;Object.defineProperty(this,'id',{get:function(){return queueId}});queueId=invoker(msgRouterBridge,'addToQueuesContainer',[this]);this.getMessageService=function(){return messageService;};this.storeMessage=function(options)
{var msgOptions={};if(!options)
utilityFunctions.throwSuiteScriptError('SSS_MISSING_REQD_ARGUMENT','options');if(!options.hasOwnProperty('source'))
utilityFunctions.throwSuiteScriptError('SSS_MISSING_REQD_ARGUMENT','source');if(!options.hasOwnProperty('data'))
utilityFunctions.throwSuiteScriptError('SSS_MISSING_REQD_ARGUMENT','data');msgOptions.source=options.source;msgOptions.data=options.data;msgOptions.reply={value:options.reply||null};msgOptions.timestamp=(new Date()).getTime();if(isServerSide()&&options.source==='message.Message'&&options.forClient===true)
{msgOptions.forClient=options.forClient;sendMessageToClient(msgOptions.data);}
messageContainer.push(new Message(msgOptions));};this.getMessages=function()
{return messageContainer.slice(0,messageContainer.length);};var DEFAULT_PROMPT_AUTO_RESPONSE='';var DEFAULT_DIALOG_AUTO_RESPONSE=true;var DEFAULT_CONFIRM_AUTO_RESPONSE=true;this.getAutoResponse=function getAutoResponse(options)
{if(!options||!options.dialogType)
{return null;}
if(options.dialogType==='prompt')
{return DEFAULT_PROMPT_AUTO_RESPONSE;}
else if(options.dialogType==='confirm')
{return DEFAULT_CONFIRM_AUTO_RESPONSE;}
else if(options.dialogType==='dialog')
{if(options.dialogOptions&&options.dialogOptions.buttons&&options.dialogOptions.buttons.length>0)
{return options.dialogOptions.buttons[0].value;}
else
return DEFAULT_DIALOG_AUTO_RESPONSE;}
return null;};this.toString=function()
{return TYPE;};this.toJSON=function()
{return{};};}
Object.freeze(MessageQueueImpl);function MessageService(messageQueueImpl)
{var TYPE='Record.MessageService';utilityFunctions.checkArgs([messageQueueImpl],['messageQueueImpl'],TYPE);var messageQueue=messageQueueImpl;Object.defineProperty(this,'id',{get:function(){return messageQueue.id;}});this.getMessages=function()
{return messageQueue.getMessages();};this.toString=function()
{return TYPE;};this.toJSON=function()
{return{};};}
Object.freeze(MessageService);var pushQueue=function pushQueue(record)
{var queueId=null;if(record&&record.hasOwnProperty('getMessageService')&&typeof record['getMessageService']==='function')
{var messageQueue=record.getMessageService();if(messageQueue instanceof Object&&messageQueue.constructor.name==='MessageService')
queueId=messageQueue.id;}
return invoker(msgRouterBridge,'pushMsgQueue',[queueId||null]);};var popQueue=function popQueue(threshold)
{return invoker(msgRouterBridge,'popMsgQueue',[threshold||1]);};var getActiveQueue=function getActiveQueue()
{var activeQueue=invoker(msgRouterBridge,'getActiveMsgQueue',[]);return activeQueue||new MessageQueueImpl();};var getMessageServiceInstance=function getMessageQueue()
{getActiveQueue();var msgQueueImpl=new MessageQueueImpl();return msgQueueImpl.getMessageService();};(function overloadGlobalAlerts(){var global=this;function getArgs(args){var _args=[];for(var i=0;i<args.length;i++)
_args.push(args[i]);return _args;}
var gAlert=global.alert;global.alert=function(){var queue=getActiveQueue();var msg={source:'window.alert',data:{args:getArgs(arguments)},reply:null};if(gAlert)gAlert.apply(null,arguments);queue.storeMessage(msg);};var gPrompt=global.prompt;global.prompt=function(){var queue=getActiveQueue();var msg={source:'window.prompt',data:{args:getArgs(arguments)},reply:null};msg.reply=gPrompt?gPrompt.apply(null,arguments):queue.getAutoResponse({dialogType:'prompt'});queue.storeMessage(msg);return msg.reply;};var gConfirm=global.confirm;global.confirm=function(){var queue=getActiveQueue();var msg={source:'window.confirm',data:{args:getArgs(arguments)},reply:null};msg.reply=gConfirm?gConfirm.apply(null,arguments):queue.getAutoResponse({dialogType:'confirm'});queue.storeMessage(msg);return msg.reply;};})();function sendMessageToClient(message)
{if(util.isObject(message))
{var msgJson=JSON.stringify(message);invoker(remoteApi,'sendMessageToClient',[msgJson]);}}
var MESSAGE_FIELD='custpage__ss_messages_for_client';var messageModule;function showMessagesFromBeforeLoad(options)
{if(!messageModule)
{require(['N/ui/message'],function(mod){messageModule=mod;showMessagesFromBeforeLoad(options);});return;}
var currentRecord=options&&options.currentRecord;var messages;try{if(currentRecord)
messages=JSON.parse(currentRecord.getValue(MESSAGE_FIELD));}catch(e){return;}
if(messages&&Array.isArray(messages.messages))
{messages.messages.forEach(function(msg){if(!msg)return;var duration=msg.duration?msg.duration:undefined;messageModule.create(msg).show(duration);})}}
return Object.freeze({getActiveQueue:getActiveQueue,pushQueue:pushQueue,popQueue:popQueue,getMessageServiceInstance:getMessageServiceInstance,showMessagesFromBeforeLoad:showMessagesFromBeforeLoad});});define('N/ui/message',['N/utilityFunctions','N/nsobject','N/error','N/msgRouter'],function(utilityFunctions,nsobject,error,msgRouter)
{var MESSAGE_TYPE=Object.freeze({CONFIRMATION:0,INFORMATION:1,WARNING:2,ERROR:3});function Message(initOptions)
{var THIS_TYPE='message.Message';var msgOptions=initOptions;var msgObject=null;var messageQueue=msgRouter.getActiveQueue();var initialDuration=msgOptions.duration;this.show=function(options)
{var msecsToShow=initialDuration;if(options!=null&&options.hasOwnProperty('duration'))
msecsToShow=options.duration;else if(util.isNumber(options))
msecsToShow=options;msecsToShow=parseInt(msecsToShow);if(isNaN(msecsToShow))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE);msgOptions.duration=msecsToShow;messageQueue.storeMessage({source:THIS_TYPE,data:msgOptions,reply:null,forClient:options&&options.sendToClient});if(typeof(NS)!=='undefined'&&typeof(NS.UI)!=='undefined'&&typeof(NS.UI.Messaging)!=='undefined'&&typeof(NS.UI.Messaging.Message)==='function')
{msgObject=new NS.UI.Messaging.Message(msgOptions);msgObject.show();}};this.hide=function()
{if(msgObject!==null)
msgObject.hide();};this.toString=function()
{return THIS_TYPE;};this.toJSON=function()
{return msgOptions;};}
Message.prototype=nsobject.getNewInstance();Object.freeze(Message);function create(options)
{var type,title,message,duration;if(options!=null)
{type=options.type;title=options.title||"";message=options.message||"";duration=options.hasOwnProperty('duration')?options.duration:0;}
utilityFunctions.checkArgs([type],['type'],'Message.create');var messageOptions={title:title,message:message,type:type,duration:duration};return new Message(messageOptions);}
return Object.freeze({create:create,Type:MESSAGE_TYPE});});define('N/ui/dialog',['N/utilityFunctions','N/error','N/msgRouter'],function(utilityFunctions,error,msgRouter)
{var DEFAULT_BUTTON_LABEL="OK";var DEFAULT_BUTTON_VALUE=true;function prepareOptions(options)
{var title="",message="";if(options!==undefined)
{title=options.hasOwnProperty("title")?options.title:"";message=options.hasOwnProperty("message")?options.message:"";}
return{title:title,message:message};}
function prepareButtons(options)
{var rawButtons;if((options===undefined)||(options===null)||!options.hasOwnProperty("buttons"))
rawButtons=[];else
rawButtons=options.buttons;if(!util.isArray(rawButtons))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE);if(rawButtons.length===0)
rawButtons=[{label:DEFAULT_BUTTON_LABEL,value:DEFAULT_BUTTON_VALUE}];return rawButtons;}
function craftButtons(options)
{var buttons=prepareButtons(options);var buttonList=[];for(var i=0;i<buttons.length;i++)
{var thisButton=buttons[i];if(!thisButton.hasOwnProperty("label")||!thisButton.hasOwnProperty("value"))
utilityFunctions.throwSuiteScriptError(error.Type.BUTTONS_MUST_INCLUDE_BOTH_A_LABEL_AND_VALUE);buttonList.push(new NS.UI.Messaging.Button({label:thisButton.label,value:thisButton.value,onClick:function(event){event.dialog.close(event);}}));}
return buttonList;}
function doDialog(options,dialogType)
{var msg={source:'dialog.'+dialogType,data:options,reply:null};var finalOptions=prepareOptions(options);var messageQueue=msgRouter.getActiveQueue();if(typeof document==='undefined'){if(dialogType==='dialog'){finalOptions.buttons=prepareButtons(options);}
msg.reply=messageQueue.getAutoResponse({dialogType:dialogType,dialogOptions:finalOptions});messageQueue.storeMessage(msg);return msg.reply;}
else{var creatorFunction;if(dialogType==='dialog'){creatorFunction=NS.UI.Messaging.Dialog;finalOptions.buttons=craftButtons(options);}
else if(dialogType==='confirm'){creatorFunction=NS.UI.Messaging.Confirm;}
else if(dialogType==='alert'){creatorFunction=NS.UI.Messaging.Alert;}
return new Promise(function(resolve,reject){try{finalOptions.onClose=function(event){var result=event.button.value;msg.reply=result;messageQueue.storeMessage(msg);resolve(result);};var myDialog=new creatorFunction(finalOptions);myDialog.open();}
catch(e){reject(e);}});}}
function doAlert(options)
{return doDialog(options,'alert');}
function doConfirm(options)
{return doDialog(options,'confirm');}
function doCreate(options)
{return doDialog(options,'dialog');}
return Object.freeze({alert:doAlert,confirm:doConfirm,create:doCreate});});define('N/ui',['N/ui/message','N/ui/dialog'],function(message,dialog)
{return Object.freeze({message:message,dialog:dialog})});define('N/restricted/urlApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/url',['N/restricted/invoker','N/restricted/urlApi'],function(invoker,urlApi)
{var HOST_TYPES=Object.freeze({APPLICATION:'APPLICATION',CUSTOMER_CENTER:'CUSTOMERCENTER',RESTLET:'RESTLETS',SUITETALK:'SUITETALK',FORM:'FORMS'});function traverseParams(prefix,obj,add)
{var rbracket=/\[\]$/;if(util.isArray(obj))
{util.each(obj,function(i,v)
{if(rbracket.test(prefix))
{add(prefix,v);}
else
{traverseParams(prefix+"["+(typeof v==="object"?i:"")+"]",v,add);}});}
else
{add(prefix,obj);}}
function format(options,params)
{var domain=options;if(util.isObject(options))
{domain=options.domain;params=options.params;}
var prefix;var s=[];var r20=/%20/g;format=format||'';function add(key,value)
{value=util.isFunction(value)?value():(value==null?"":value);s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value);};if(util.isArray(params))
{for(var i=0;i<params.length;i++)
add(i,params[i]);}
else
{for(prefix in params)
{traverseParams(prefix,params[prefix],add);}}
var queryString=s.join("&").replace(r20,"+");var separator=(domain.indexOf('?')===-1)?'?':'&';return domain+separator+queryString;}
return Object.freeze({resolveRecord:function resolveRecord(opts)
{var url=invoker(urlApi,'nlapiResolveURL',['RECORD',opts.recordType,opts.recordId||null,opts.isEditMode===true?'EDIT':null]);if(opts.params)
url=format(url,opts.params);return url;},resolveTaskLink:function resolveTaskLink(options,params)
{var taskId=options;if(util.isObject(options))
{taskId=options.id;params=options.params;}
var url=invoker(urlApi,'nlapiResolveURL',['TASKLINK',taskId,null,null]);if(params)
url=format(url,params);return url;},resolveScript:function resolveScript(opts)
{var url=invoker(urlApi,'nlapiResolveURL',['WEB_SCRIPT',opts.scriptId,opts.deploymentId,opts.returnExternalUrl===true?'EXTERNAL':null]);if(opts.params)
url=format(url,opts.params);return url;},resolveDomain:function resolveDomain(opts)
{return invoker(urlApi,'nlapiResolveDomain',[opts.hostType,opts.accountId||null]);},format:format,HostType:HOST_TYPES});});define('N/restricted/recordApi',['N/restricted/reflet'],function(reflet){return reflet;});define('N/restricted/recordRemoteApiBridge',['N/restricted/reflet'],function(reflet){return reflet;});define('N/record/recordConstants',[],function()
{var RECORD_MODE=Object.freeze({DYNAMIC_RECORD:'dynamic record',DEFERRED_DYNAMIC_RECORD:'standard record',READ_ONLY_RECORD:'read-only record'});var SUBRECORD_MODE=Object.freeze({DYNAMIC_SUBRECORD:'dynamic subrecord',DEFERRED_DYNAMIC_SUBRECORD:'standard subrecord',READ_ONLY_SUBRECORD:'read-only subrecord'});var CURRENT_RECORD_MODE=Object.freeze({CURRENT_RECORD:'current record',READ_ONLY_CURRENT_RECORD:'read-only current record'});var CURRENT_SUBRECORD_MODE=Object.freeze({CURRENT_SUBRECORD:'current subrecord',READ_ONLY_CURRENT_SUBRECORD:'read-only current subrecord'});var ALL_RECORD_PROXY_NAMES=Object.freeze([RECORD_MODE.DYNAMIC_RECORD,RECORD_MODE.DEFERRED_DYNAMIC_RECORD,RECORD_MODE.READ_ONLY_RECORD,SUBRECORD_MODE.DYNAMIC_SUBRECORD,SUBRECORD_MODE.DEFERRED_DYNAMIC_SUBRECORD,SUBRECORD_MODE.READ_ONLY_SUBRECORD,CURRENT_RECORD_MODE.CURRENT_RECORD,CURRENT_RECORD_MODE.READ_ONLY_CURRENT_RECORD,CURRENT_SUBRECORD_MODE.CURRENT_SUBRECORD,CURRENT_SUBRECORD_MODE.READ_ONLY_CURRENT_SUBRECORD]);var LINE_MODE=Object.freeze({DYNAMIC_LINE:'dynamic record sublist line',DEFERRED_DYNAMIC_LINE:'standard record sublist line',READ_ONLY_LINE:'read-only record sublist line'});var RECORD_UNDERLYING_IMPL_NAME=Object.freeze({CLIENT_DYNAMIC_RECORD:'recordDefinition.Record',DOM_CURRENT_RECORD:'DomCurrentRecord',DOM_CURRENT_SUBRECORD:'DomCurrentSubrecord',SERVER_DYNAMIC_RECORD:'RecordImpl',SERVER_DYNAMIC_SUBRECORD:'SubrecordImpl'});var ALL_RECORD_UNDERLYING_IMPL_NAMES=Object.freeze([RECORD_UNDERLYING_IMPL_NAME.CLIENT_DYNAMIC_RECORD,RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_RECORD,RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_SUBRECORD,RECORD_UNDERLYING_IMPL_NAME.SERVER_DYNAMIC_RECORD,RECORD_UNDERLYING_IMPL_NAME.SERVER_DYNAMIC_SUBRECORD]);return Object.freeze({RECORD_MODE:RECORD_MODE,SUBRECORD_MODE:SUBRECORD_MODE,CURRENT_RECORD_MODE:CURRENT_RECORD_MODE,CURRENT_SUBRECORD_MODE:CURRENT_SUBRECORD_MODE,ALL_RECORD_PROXY_NAMES:ALL_RECORD_PROXY_NAMES,LINE_MODE:LINE_MODE,RECORD_UNDERLYING_IMPL_NAME:RECORD_UNDERLYING_IMPL_NAME,ALL_RECORD_UNDERLYING_IMPL_NAMES:ALL_RECORD_UNDERLYING_IMPL_NAMES});});define('N/fieldUtil',["N/utilityFunctions","N/error"],function(utilityFunctions,error)
{var SELECT_FIELD_TYPES=Object.freeze({SELECT:'select',MULTI_SELECT:'multiselect'});var RADIO_TYPE='radio';var CUSTPAGE_PREFIX='custpage';var SELECT_FIELD_TYPE_LIST=[SELECT_FIELD_TYPES.SELECT,SELECT_FIELD_TYPES.MULTI_SELECT];function verifyPrefixedWithCustPage(fieldName)
{utilityFunctions.assertTrue(isPrefixedWithCustPage(fieldName),error.Type.SSS_INVALID_UI_OBJECT_TYPE);}
function isPrefixedWithCustPage(fieldName)
{return(!utilityFunctions.isValEmpty(fieldName))&&(fieldName.indexOf(CUSTPAGE_PREFIX)===0)}
function isMultiSelectType(type)
{return type===SELECT_FIELD_TYPES.MULTI_SELECT;}
function isSelectType(type)
{return SELECT_FIELD_TYPE_LIST.indexOf(type)>-1;}
function isSelectTypeOrRadio(type)
{return isSelectType(type)||type===RADIO_TYPE;}
return{verifyPrefixedWithCustPage:verifyPrefixedWithCustPage,isPrefixedWithCustPage:isPrefixedWithCustPage,isMultiSelectType:isMultiSelectType,isSelectType:isSelectType,isSelectTypeOrRadio:isSelectTypeOrRadio,SELECT_FIELD_TYPES:SELECT_FIELD_TYPES};});define('N/field',['N/error','N/nsobject','N/restricted/invoker','N/utilityFunctions','N/fieldUtil'],function(error,nsobject,invoker,utilityFunctions,fieldUtil)
{function Field(delegate)
{Object.defineProperty(this,'label',{get:function()
{return invoker(delegate,'getLabel');},set:function(val)
{return invoker(delegate,'setLabel',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function()
{return invoker(delegate,'getName');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'field.Field.id');},enumerable:true,configurable:false});Object.defineProperty(this,'isDisabled',{get:function()
{return invoker(delegate,'isDisabled');},set:function(val)
{invoker(delegate,'setDisabled',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'isDisplay',{get:function()
{return invoker(delegate,'isDisplay');},set:function(val)
{invoker(delegate,'setDisplay',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'isMandatory',{get:function()
{return invoker(delegate,'isMandatory');},set:function(val)
{invoker(delegate,'setMandatory',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'isReadOnly',{get:function()
{return invoker(delegate,'isReadOnly');},set:function(val)
{invoker(delegate,'setReadOnly',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'isVisible',{get:function()
{return invoker(delegate,'isVisible');},set:function(val)
{invoker(delegate,'setVisible',[val]);},enumerable:true,configurable:false});Object.defineProperty(this,'type',{get:function()
{return invoker(delegate,'getType');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'field.Field.type');},enumerable:true,configurable:false});Object.defineProperty(this,'sublistId',{get:function()
{return invoker(delegate,'getSublistName');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'field.Field.sublistId');},enumerable:true,configurable:false});Object.defineProperty(this,'isPopup',{get:function()
{return invoker(delegate,'isPopup');},set:function(val)
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'field.Field.isPopup');},enumerable:true,configurable:false});function getSelectOptions(options,filteroperator)
{var filter=options;if(utilityFunctions.isObject(options))
{filter=options.filter;filteroperator=options.operator;}
var sOptions=[];var optionObjects=invoker(delegate,'getSelectOptions',[filter||null,filteroperator||null]);for(var i in optionObjects)
{if(!optionObjects.hasOwnProperty(i))
continue;sOptions[sOptions.length]={'value':optionObjects[i].getId(),'text':optionObjects[i].getText()};}
return sOptions;};if(fieldUtil.isSelectTypeOrRadio(this.type))
this.getSelectOptions=getSelectOptions;function insertSelectOption(options,text)
{var value,selected=false,that=this,undef=undefined;if(text!==undef)
{value=options;}
else if(options!==undef&&options!==null)
{value=options.value;text=options.text;selected=options.isSelected||false;}
if(!invoker(delegate,'isCurrentRecord',[]))
fieldUtil.verifyPrefixedWithCustPage(that.id);utilityFunctions.checkArgs([value,text],['value','text'],'Field.insertSelectOption');invoker(delegate,'insertSelectOption',[String(value),text,selected]);}
function removeSelectOption(options)
{var undef=undefined,that=this,value=((options!==undef)&&(options!==null)&&(options.value!==undef))?options.value:options;fieldUtil.verifyPrefixedWithCustPage(that.id);utilityFunctions.checkArgs([value],['value'],'Field.removeSelectOption');invoker(delegate,'removeSelectOption',[String(value)]);}
if(fieldUtil.isSelectType(this.type)){this.insertSelectOption=insertSelectOption;this.removeSelectOption=removeSelectOption;}
this.toJSON=function toJSON()
{return{'id':this.id,'label':this.label,'type':this.type};};this.toString=function toString()
{return "Field";};}
Field.prototype=nsobject.getNewInstance();return Object.freeze({create:function create(f)
{try
{return Object.freeze(new Field(f));}
catch(e)
{throw error.create(e);}}});});define('N/metadata/fieldDefinition',['N/restricted/invoker','N/utilityFunctions','N/nsobject','N/error'],function(invoker,utilityFunctions,nsobject,error){var FIELD_CATEGORY={CURRENT_BODY:'currentBody',CURRENT_SUBLIST:'currentSublist',DYNAMIC_BODY:'dynamicBody',DYNAMIC_SUBLIST:'dynamicSublist',DEFERRED_DYNAMIC_BODY:'deferredDynamicBody',DEFERRED_DYNAMIC_SUBLIST:'deferredDynamicSublist',DEFERRED_DYNAMIC_CURRENT_BODY:'deferredDynamicCurrentBody',DEFERRED_DYNAMIC_CURRENT_SUBLIST:'deferredDynamicCurrentSublist',READ_ONLY_BODY:'readOnlyRecordBody',READ_ONLY_SUBLIST:'readOnlyRecordSublist'};FIELD_CATEGORY.getInstance=function getFieldCategoryInstance(options){var category;if(!!options.isDynamic)
{category=!!options.isSublistField?FIELD_CATEGORY.DYNAMIC_SUBLIST:FIELD_CATEGORY.DYNAMIC_BODY;}
else if(!!options.isReadOnly)
{category=!!options.isSublistField?FIELD_CATEGORY.READ_ONLY_SUBLIST:FIELD_CATEGORY.READ_ONLY_BODY;}
else
{category=!!options.isSublistField?FIELD_CATEGORY.DEFERRED_DYNAMIC_SUBLIST:FIELD_CATEGORY.DEFERRED_DYNAMIC_BODY;}
return category;};FIELD_CATEGORY=utilityFunctions.freezeObjectIfPossible(FIELD_CATEGORY);var FIELD_PROPERTIES=Object.freeze({ID:"id",LABEL:"label",TYPE:"type",SUBLIST_ID:"sublistId",SELECT_OPTION_PROP:"selectOptionProp",IS_MANDATORY:"isMandatory",IS_DISABLED:"isDisabled",IS_POPUP:"isPopup",IS_DISPLAY:"isDisplay",IS_VISIBLE:"isVisible",IS_READ_ONLY:"isReadOnly",TO_JSON:"toJSON",TO_STRING:"toString"});var ACCESS_LEVEL=Object.freeze({NONE:0,READ_ONLY:1,READ_WRITE:2});function Field(delegate,permissions)
{function authorizeThenWrite(accessLevel,setFunction,errorMsg)
{if(accessLevel===ACCESS_LEVEL.READ_WRITE)
{setFunction();}
else
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,errorMsg);}}
function noAction(){}
if(permissions[FIELD_PROPERTIES.ID]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'id',{get:function()
{return delegate.id;},set:function(val)
{authorizeThenWrite(permissions[FIELD_PROPERTIES.ID],noAction,"Field.id");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.LABEL]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'label',{get:function()
{return delegate.label;},set:function(label)
{var setFunction=function()
{delegate.label=label;};authorizeThenWrite(permissions[FIELD_PROPERTIES.LABEL],setFunction,"Field.label");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.TYPE]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'type',{get:function()
{return delegate.type;},set:function(val)
{authorizeThenWrite(permissions[FIELD_PROPERTIES.TYPE],noAction,"Field.type");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.SUBLIST_ID]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'sublistId',{get:function()
{return delegate.sublistId;},set:function(val)
{authorizeThenWrite(permissions[FIELD_PROPERTIES.SUBLIST_ID],noAction,"Field.sublistId");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.SELECT_OPTION_PROP]>ACCESS_LEVEL.NONE)
{this.getSelectOptions=delegate.getSelectOptions;this.insertSelectOption=delegate.insertSelectOption;this.removeSelectOption=delegate.removeSelectOption;}
if(permissions[FIELD_PROPERTIES.IS_MANDATORY]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isMandatory',{get:function()
{return delegate.isMandatory;},set:function(required)
{var setFunction=function()
{if(!util.isBoolean(required))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,"Field.isMandatory",'boolean');delegate.isMandatory=required;};authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_MANDATORY],setFunction,"Field.isMandatory");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.IS_DISABLED]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isDisabled',{get:function()
{return delegate.isDisabled;},set:function(val)
{var setFunction=function()
{if(!util.isBoolean(val))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,"Field.isDisabled",'boolean');delegate.isDisabled=val;};authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_DISABLED],setFunction,"Field.isDisabled");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.IS_POPUP]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isPopup',{get:function()
{return delegate.isPopup;},set:function(val)
{authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_POPUP],noAction,"Field.isPopup");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.IS_DISPLAY]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isDisplay',{get:function()
{return delegate.isDisplay;},set:function(show)
{var setFunction=function()
{if(!util.isBoolean(show))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,"Field.isDisplay",'boolean');delegate.isDisplay=show;};authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_DISPLAY],setFunction,"Field.isDisplay");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.IS_VISIBLE]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isVisible',{get:function()
{return delegate.isVisible;},set:function(show)
{var setFunction=function()
{if(!util.isBoolean(show))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,"Field.isVisible",'boolean');delegate.isVisible=show;};authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_VISIBLE],setFunction,"Field.isVisible");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.IS_READ_ONLY]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,'isReadOnly',{get:function()
{return delegate.isReadOnly},set:function(val)
{var setFunction=function()
{if(!util.isBoolean(val))
utilityFunctions.throwSuiteScriptError(error.Type.WRONG_PARAMETER_TYPE,"Field.isReadOnly",'boolean');delegate.isReadOnly=val;};authorizeThenWrite(permissions[FIELD_PROPERTIES.IS_READ_ONLY],setFunction,"Field.isReadOnly");},enumerable:true,configurable:false});}
if(permissions[FIELD_PROPERTIES.TO_JSON]>ACCESS_LEVEL.NONE)
{this.toJSON=delegate.toJSON;}
if(permissions[FIELD_PROPERTIES.TO_STRING]>ACCESS_LEVEL.NONE)
{this.toString=delegate.toString;}}
Field.prototype=nsobject.getNewInstance();Object.freeze(Field);return Object.freeze({Category:FIELD_CATEGORY,Property:FIELD_PROPERTIES,Access:ACCESS_LEVEL,create:function(delegate,permissions)
{return!delegate?null:Object.freeze(new Field(delegate,permissions));}});});define('N/metadata/fieldPermissions',['N/metadata/fieldDefinition'],function(fieldDef){var dynamicBody={};dynamicBody[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;dynamicBody[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;dynamicBody[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;dynamicBody[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.READ_ONLY;dynamicBody[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;dynamicBody[fieldDef.Property.IS_DISABLED]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.IS_POPUP]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.NONE;dynamicBody[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;dynamicBody[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var dynamicSublist={};dynamicSublist[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;dynamicSublist[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;dynamicSublist[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;dynamicSublist[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.READ_ONLY;dynamicSublist[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.READ_ONLY;dynamicSublist[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;dynamicSublist[fieldDef.Property.IS_DISABLED]=fieldDef.Access.NONE;dynamicSublist[fieldDef.Property.IS_POPUP]=fieldDef.Access.NONE;dynamicSublist[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.NONE;dynamicSublist[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.NONE;dynamicSublist[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.NONE;dynamicSublist[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;dynamicSublist[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var deferredDynamicBody={};deferredDynamicBody[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;deferredDynamicBody[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;deferredDynamicBody[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;deferredDynamicBody[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;deferredDynamicBody[fieldDef.Property.IS_DISABLED]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.IS_POPUP]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.NONE;deferredDynamicBody[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;deferredDynamicBody[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var deferredDynamicSublist={};deferredDynamicSublist[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;deferredDynamicSublist[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;deferredDynamicSublist[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;deferredDynamicSublist[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.READ_ONLY;deferredDynamicSublist[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;deferredDynamicSublist[fieldDef.Property.IS_DISABLED]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.IS_POPUP]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.NONE;deferredDynamicSublist[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;deferredDynamicSublist[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var currentBody={};currentBody[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;currentBody[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;currentBody[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.NONE;currentBody[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.READ_ONLY;currentBody[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;currentBody[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_WRITE;currentBody[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;currentBody[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var currentSublist={};currentSublist[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;currentSublist[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;currentSublist[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_WRITE;currentSublist[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;currentSublist[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var deferredDynamicCurrentBody={};deferredDynamicCurrentBody[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentBody[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentBody[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.NONE;deferredDynamicCurrentBody[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;deferredDynamicCurrentBody[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentBody[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentBody[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentBody[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var deferredDynamicCurrentSublist={};deferredDynamicCurrentSublist[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.LABEL]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentSublist[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;deferredDynamicCurrentSublist[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentSublist[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_WRITE;deferredDynamicCurrentSublist[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;deferredDynamicCurrentSublist[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var readOnlyRecordBody={};readOnlyRecordBody[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.LABEL]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.NONE;readOnlyRecordBody[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;readOnlyRecordBody[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;readOnlyRecordBody[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var readOnlyRecordSublist={};readOnlyRecordSublist[fieldDef.Property.ID]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.TYPE]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.LABEL]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.SUBLIST_ID]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.SELECT_OPTION_PROP]=fieldDef.Access.NONE;readOnlyRecordSublist[fieldDef.Property.IS_MANDATORY]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.IS_DISABLED]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.IS_POPUP]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.IS_DISPLAY]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.IS_VISIBLE]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.IS_READ_ONLY]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.TO_JSON]=fieldDef.Access.READ_ONLY;readOnlyRecordSublist[fieldDef.Property.TO_STRING]=fieldDef.Access.READ_ONLY;var masterPermission={};masterPermission[fieldDef.Category.CURRENT_BODY]=currentBody;masterPermission[fieldDef.Category.CURRENT_SUBLIST]=currentSublist;masterPermission[fieldDef.Category.DYNAMIC_BODY]=dynamicBody;masterPermission[fieldDef.Category.DYNAMIC_SUBLIST]=dynamicSublist;masterPermission[fieldDef.Category.DEFERRED_DYNAMIC_BODY]=deferredDynamicBody;masterPermission[fieldDef.Category.DEFERRED_DYNAMIC_SUBLIST]=deferredDynamicSublist;masterPermission[fieldDef.Category.DEFERRED_DYNAMIC_CURRENT_BODY]=deferredDynamicCurrentBody;masterPermission[fieldDef.Category.DEFERRED_DYNAMIC_CURRENT_SUBLIST]=deferredDynamicCurrentSublist;masterPermission[fieldDef.Category.READ_ONLY_BODY]=readOnlyRecordBody;masterPermission[fieldDef.Category.READ_ONLY_SUBLIST]=readOnlyRecordSublist;var convertToCurrentVersion={};convertToCurrentVersion[fieldDef.Category.CURRENT_BODY]=fieldDef.Category.CURRENT_BODY;convertToCurrentVersion[fieldDef.Category.CURRENT_SUBLIST]=fieldDef.Category.CURRENT_SUBLIST;convertToCurrentVersion[fieldDef.Category.DYNAMIC_BODY]=fieldDef.Category.CURRENT_BODY;convertToCurrentVersion[fieldDef.Category.DYNAMIC_SUBLIST]=fieldDef.Category.CURRENT_SUBLIST;convertToCurrentVersion[fieldDef.Category.DEFERRED_DYNAMIC_BODY]=fieldDef.Category.DEFERRED_DYNAMIC_CURRENT_BODY;convertToCurrentVersion[fieldDef.Category.DEFERRED_DYNAMIC_SUBLIST]=fieldDef.Category.DEFERRED_DYNAMIC_CURRENT_SUBLIST;convertToCurrentVersion[fieldDef.Category.READ_ONLY_BODY]=fieldDef.Category.READ_ONLY_BODY;convertToCurrentVersion[fieldDef.Category.READ_ONLY_SUBLIST]=fieldDef.Category.READ_ONLY_SUBLIST;function getPermission(type,isCurrent)
{var trueType=isCurrent?convertToCurrentVersion[type]:type;return masterPermission[trueType];}
return Object.freeze({getPermissions:getPermission});});define('N/metadata/fieldMetadata',['N/utilityFunctions','N/metadata/fieldDefinition','N/metadata/fieldPermissions'],function(utilityFunctions,fieldDef,fieldPermissions){function wrap(options)
{var fieldCategory=options.category||null,delegate=options.delegate||null,isCurrent=options.current||false;utilityFunctions.checkArgs([fieldCategory,delegate],["fieldCategory","delegate"],"fieldMetadata");return fieldDef.create(delegate,fieldPermissions.getPermissions(fieldCategory,isCurrent));}
return Object.freeze({Category:fieldDef.Category,wrap:wrap});});define('N/util/sqlInjectionFilter',["N/restricted/invoker",'N/restricted/remoteApiBridge'],function(invoker,apiBridge){var SQL_SELECT_STRING_REGEX=/select[ ].+from[ ]?[^ ,]*[ ,]+((all)?(trandoc|tranline|trancard|entity|custjob|emaillogin|emailpassword|emailpasswordhistory|emailpasswordnewhistory)|([a-zA-Z_0-9]*)?@SIGNUPDB_0|([a-zA-Z_0-9]*)?@SANDBOX_SIGNUPDB_0|pwdresetanswers|v\$|source\$|dbms_|all_|dba_|user_|java\$|nl_)/i;function validateSqlInjection(fieldId,toValidate)
{if(isNonEmptyString(toValidate))
{var matches=SQL_SELECT_STRING_REGEX.exec(toValidate.replace(/\s/g,' '));if(matches!=null&&matches.length>1&&matches[1].trim().length>0)
logSQLInjectionError(fieldId,toValidate,matches[1]);}}
function logSQLInjectionError(fieldId,toValidate,firstCaptureGroup)
{invoker(apiBridge,'logSQLInjectionError',[fieldId,toValidate,firstCaptureGroup]);}
function isNonEmptyString(toValidate)
{return(util.isString(toValidate)&&toValidate.length>0);}
return Object.freeze({validateSqlInjection:validateSqlInjection});});define('N/record/recordUtilityFunctions',['N/restricted/invoker','N/utilityFunctions','N/error','N/restricted/remoteApiBridge','N/util/sqlInjectionFilter'],function(invoker,utilityFunctions,error,clientScriptHandler,sqlInjectionFilter)
{var undef=undefined;var FIELD_TYPE={SUBRECORD_FIELD_TYPE:'summary',MULTISELECT:'multiselect',RADIO:'radio',SELECT:'select',CHECKBOX:'checkbox',TIME:"time",TIMETRACK:"timetrack"};var MACHINE_TYPE={INLINE_EDIT:'inlineeditor'};var SELECT_FIELD_TYPE=[FIELD_TYPE.SELECT,FIELD_TYPE.MULTI_SELECT];function isSelectType(type)
{return SELECT_FIELD_TYPE.indexOf(type)>-1;}
var EDIT_MACHINE_TYPE=[MACHINE_TYPE.INLINE_EDIT];function isEditMachine(sublist)
{return EDIT_MACHINE_TYPE.indexOf(sublist.type)>-1;}
function handleOverloadingMethodsForSingleArgument(options,key,errorMessageFillerValue)
{var argument=options!==undef&&options!==null&&!util.isString(options)?options[key]:options;utilityFunctions.checkArgs([argument],[key],errorMessageFillerValue);return argument;}
function emptyIfNullOrUndefined(value)
{if(value===null||value===undefined)
return "";else
return value;}
function assertValidSublistOperation(isValid)
{if(!isValid)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SUBLIST_OPERATION);}
function formatValueToArrayType(value)
{if(!value&&value!==0&&value!=='')
return value;else
{if(typeof value==='string'&&value.indexOf(String.fromCharCode(5))!==-1)
value=value.split(String.fromCharCode(5));return util.isArray(value)?value:(!utilityFunctions.isValEmpty(value))?[value]:[];}}
function formatArrayToStringType(value)
{if(util.isArray(value))
return value.join(String.fromCharCode(5));else
return String(value);}
function validateAgainstSqlInjection(fieldId,value)
{sqlInjectionFilter.validateSqlInjection(fieldId,value);}
function forEachProperty(obj,f)
{for(var pKey in obj)
{if(obj.hasOwnProperty(pKey))
{f(pKey,obj[pKey]);}}}
function executeRecordGetterFunctionsForInstance(sublistId,fieldId,lineInstanceId,useBuffer,bodyFieldFunction,sublistFieldFunction)
{var toRet=null;if(!!sublistId)
{toRet=sublistFieldFunction(sublistId,fieldId,lineInstanceId,useBuffer);}
else
{toRet=bodyFieldFunction(fieldId);}
return toRet;}
function executeRecordGetterFunctions(sublistId,fieldId,line,bodyFieldFunction,sublistFieldFunction,currentSublistFieldFunctions)
{var toRet=null;if(sublistId)
{if(line>=0)
toRet=sublistFieldFunction(sublistId,fieldId,line);else
toRet=currentSublistFieldFunctions(sublistId,fieldId);}
else
{toRet=bodyFieldFunction(fieldId);}
return toRet;}
function matchRecordFieldValueSchema(obj)
{return util.isObject(obj)&&obj.hasOwnProperty('value')&&obj.hasOwnProperty('legacyStringValue');}
function transformRawValueToFieldValueSchema(obj,cacher)
{if(typeof(obj)==='string'){obj=obj.replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&").replace(/<br>/g,'\n');}
var fieldValue={}
if(util.isObject(obj)&&obj.hasOwnProperty('id')&&obj.hasOwnProperty('text'))
{fieldValue={value:undefined,legacyStringValue:obj.id};cacher(obj.id,obj.text);}
else
fieldValue={value:undefined,legacyStringValue:obj};return fieldValue;}
function validateRecordFieldValueSchema(val)
{if(!matchRecordFieldValueSchema(val)&&val!==null&&val!==undefined)
{utilityFunctions.throwSuiteScriptError(error.Type.FAILED_AN_UNEXPECTED_ERROR_OCCURRED);}}
function clone(receiver,contributor)
{for(var key in contributor)
if(contributor.hasOwnProperty(key))
{var value=contributor[key];if(util.isDate(contributor[key]))
{value=new Date(value);}
else if(util.isArray(value))
{value=value.map(function(v){return v;})}
receiver[key]=value;}
return receiver;}
function getZeroBasedIndex(index)
{if(isNaN(index))
return index;else
index=parseInt(index,10);return index>0?index-1:index;}
function getOneBasedIndex(index)
{if(isNaN(index))
return index;else
index=parseInt(index,10);return index>=0?index+1:index;}
function validateAndGetOneBasedIndex(index,method,indexUpperLimit)
{if(isNaN(index))
return index;else
index=parseInt(index,10);if(index<0||(indexUpperLimit!==undefined&&index>=indexUpperLimit))
{throw error.create({name:error.Type.INVALID_SUBLIST_OPERATION,message:method});}
else
{return index+1;}}
function getClientSlavingResultFromMetadata(clientSlavingMetadata,masterValue,getClientSlavingMetadata)
{var slaveResults={fields:[]};for(var slaveFieldId in clientSlavingMetadata)
{var clientSlavingResult=clientSlavingMetadata[slaveFieldId];var result={isClientSlaving:true};result.name=clientSlavingResult.name;if(clientSlavingResult.machine)
result.machine=clientSlavingResult.machine;if(clientSlavingResult.firechange||getClientSlavingMetadata(result.machine,result.name)!==null)
result.firechange=true;if(clientSlavingResult.condition)
result.condition=clientSlavingResult.condition;if(clientSlavingResult.nooverride)
result.nooverride=clientSlavingResult.nooverride;if(clientSlavingResult.values)
result.value=clientSlavingResult.values["_"+masterValue]||"";if(clientSlavingResult.options&&util.isArray(clientSlavingResult.options))
{result.options=[];var selectOptions=clientSlavingResult.options;for(var i=0;i<selectOptions.length;i++)
{if(!!selectOptions[i].isSelected)
result.value=selectOptions[i].value;result.options.push([selectOptions[i].value,selectOptions[i].text]);}}
slaveResults.fields.push(result);}
return slaveResults;}
return{FIELD_TYPE:FIELD_TYPE,clone:clone,no_op_function:function(){},isSelectType:isSelectType,isEditMachine:isEditMachine,executeRecordGetterFunctions:executeRecordGetterFunctions,executeRecordGetterFunctionsForInstance:executeRecordGetterFunctionsForInstance,forEachProperty:forEachProperty,handleOverloadingMethodsForSingleArgument:handleOverloadingMethodsForSingleArgument,emptyIfNullOrUndefined:emptyIfNullOrUndefined,assertValidSublistOperation:assertValidSublistOperation,formatValueToArrayType:formatValueToArrayType,formatArrayToStringType:formatArrayToStringType,validateAgainstSqlInjection:validateAgainstSqlInjection,validateRecordFieldValueSchema:validateRecordFieldValueSchema,matchRecordFieldValueSchema:matchRecordFieldValueSchema,getZeroBasedIndex:getZeroBasedIndex,getOneBasedIndex:getOneBasedIndex,validateAndGetOneBasedIndex:validateAndGetOneBasedIndex,getClientSlavingResultFromMetadata:getClientSlavingResultFromMetadata,transformRawValueToFieldValueSchema:transformRawValueToFieldValueSchema};});define('N/record/fieldLevelMetadataEvent',[],function()
{var EVENT_TYPE=Object.freeze({LABEL_CHANGE:'LABEL_CHANGE'});function getEvent(type,fieldLevelMetadata)
{return{type:type,fieldLevelMetadata:fieldLevelMetadata};}
function addFieldValues(event,oldValue,newValue)
{event.oldValue=oldValue;if(newValue!==undefined)
{event.newValue=newValue;}
return event;}
function emit(emitter,fieldLevelMetadata,type,oldValue,newValue)
{emitter.emit(addFieldValues(getEvent(type,fieldLevelMetadata),oldValue,newValue));}
return Object.freeze({Type:EVENT_TYPE,emit:emit});});define('N/eventEmitter',['N/utilityFunctions','N/error'],function(utilityFunctions,error)
{function assertArray(types)
{var isArray=Array.isArray(types);if(!isArray)
{utilityFunctions.throwSuiteScriptError('error.Type.INVALID_ARRAY');}}
function assertEventType(validEventTypes,checkEventTypes)
{var invalidEventTypeFound=!!validEventTypes&&checkEventTypes.some(function(v){return validEventTypes.indexOf(v)===-1;});if(invalidEventTypeFound)
{utilityFunctions.throwSuiteScriptError('error.Type.INVALID_EVENT_TYPE');}}
function assertListener(listener)
{if(typeof listener!=='function')
{utilityFunctions.throwSuiteScriptError('error.Type.INVALID_EVENT_LISTENER');}}
function assertAsyncAvailable()
{if(typeof setTimeout!=='function')
{utilityFunctions.throwSuiteScriptError('error.Type.ASYNC_EVENTS_UNAVAILABLE');}}
function asyncTransform(listener)
{return function(event)
{setTimeout(listener.bind(null,event),0);};}
function insulatedTransform(listener)
{return function(event){try
{listener(event);}
catch(e)
{if(!!console&&!!console.error)
{console.error(e);}}};}
function assertFunction(func)
{if(typeof func!=='function')
{utilityFunctions.throwSuiteScriptError('error.Type.NOT_A_FUNCTION');}}
function createListenerCollection()
{var eventsListeners={};function getEventListeners(eventType)
{var result=eventsListeners[eventType];if(!result)
{result=[];eventsListeners[eventType]=result;}
return result;}
function add(type,listener)
{var listeners=getEventListeners(type);listeners.push(listener);}
function get(type)
{return getEventListeners(type).slice(0);}
function remove(type,listener)
{var listeners=getEventListeners(type);var index=0;var count=listeners.length;if(!!listener)
{index=listeners.indexOf(listener);count=1;}
if(index!=-1){listeners.splice(index,count);}}
return Object.freeze({add:add,get:get,remove:remove});}
function createEmitter(options)
{var async=!!options&&!!options.async;var isBlocking=async;var insulated=!!options&&!!options.insulated;var eventTypes=!!options&&options.eventTypes||null;var preProcessor=!!options&&options.preProcessor||null;var heldEvents=[];var heldEventsEmittingFunction=null;var eventsListeners=createListenerCollection();if(async)
{assertAsyncAvailable();}
function on(options){var types=!!options&&options.types||null;var listener=!!options&&options.listener||null;utilityFunctions.checkArgs([types,listener],['types','listener'],'emitter.on');assertArray(types);assertEventType(eventTypes,types);assertListener(listener);types.forEach(function(type){eventsListeners.add(type,listener);});}
function off(options)
{var types=!!options&&options.types||null;var listener=!!options&&options.listener||null;utilityFunctions.checkArgs([types],['types'],'emitter.off');assertArray(types);assertEventType(eventTypes,types);types.forEach(function(type){eventsListeners.remove(type,listener);});}
function emitHeldEvents(){function emitHeldEventsInternal(){if(!!preProcessor)
{heldEvents=preProcessor(heldEvents);}
var errorEvents=[];heldEvents.forEach(function(event){if(event.type==="ERROR"&&errorEvents.indexOf(event.error)!=-1)
return;if(!!event.error)
errorEvents.push(event.error);if(!event.suppressEmit)
internalEmit(event);});heldEvents=[];heldEventsEmittingFunction=null;}
if(!heldEventsEmittingFunction)
{heldEventsEmittingFunction=emitHeldEventsInternal;setTimeout(heldEventsEmittingFunction,0);}}
function internalEmit(event)
{var type=!!event&&event.type||null;eventsListeners.get(type).forEach(function(listener){var func=listener;func=insulated?insulatedTransform(func):func;func=async?asyncTransform(func):func;func(event);});}
function emit(event)
{var type=!!event&&event.type||null;utilityFunctions.checkArgs([event,type],['event','type'],'emitter.emit');assertEventType(eventTypes,[type]);if(isBlocking)
{heldEvents.push(event);emitHeldEvents();}
else
{if(!!preProcessor)
{event=preProcessor([event])[0];}
internalEmit(event);}}
return Object.freeze({on:on,off:off,emit:emit});}
return Object.freeze({create:createEmitter});});define('N/record/fieldLevelMetadata',['N/record/recordUtilityFunctions','N/utilityFunctions','N/record/fieldLevelMetadataEvent','N/eventEmitter'],function(recordUtil,utilityFunctions,fieldLevelMetadataEvent,eventEmitter){function FieldLevelMetadata(metadata)
{var that=this;var label=metadata.label;var defaultFieldStates=metadata.hasOwnProperty('fieldState')?metadata.fieldState:{};var emitter=eventEmitter.create();Object.defineProperty(this,'label',{get:function()
{return label;},set:function(val)
{var oldValue=label;label=val;var newValue=label;fieldLevelMetadataEvent.emit(emitter,that,fieldLevelMetadataEvent.Type.LABEL_CHANGE,oldValue,newValue);},enumerable:true,configurable:false});function getName(){return metadata.name;}
utilityFunctions.addReadOnlyProperty(that,'name',getName);function getType(){return metadata.type;}
utilityFunctions.addReadOnlyProperty(that,'type',getType);function isFieldMultiSelect(){return metadata.type===recordUtil.FIELD_TYPE.MULTISELECT;}
utilityFunctions.addReadOnlyProperty(that,'isTypeMultiSelect',isFieldMultiSelect);function isFieldSelectType(){return recordUtil.isSelectType(metadata.type);}
utilityFunctions.addReadOnlyProperty(that,'isTypeSelect',isFieldSelectType);function isFieldRadioType(){return metadata.type===recordUtil.FIELD_TYPE.RADIO;}
utilityFunctions.addReadOnlyProperty(that,'isTypeRadio',isFieldRadioType);function getRadioSet(){return metadata.radioSet||null;}
utilityFunctions.addReadOnlyProperty(that,'radioSet',getRadioSet);function isPopup(){return metadata.isPopup||false;}
utilityFunctions.addReadOnlyProperty(that,'isPopup',isPopup);function hasStaticOptions(){return metadata.hasStaticOptions||false;}
utilityFunctions.addReadOnlyProperty(that,'hasStaticOptions',hasStaticOptions);function getSupplementedOptions(){return metadata.supplementedOptions||null;}
utilityFunctions.addReadOnlyProperty(that,'supplementedOptions',getSupplementedOptions);function isMachineHeaderField(){return metadata.isMachineHeaderField||false;}
utilityFunctions.addReadOnlyProperty(that,'isMachineHeaderField',isMachineHeaderField);function acceptEmptyValueForSelectField(){return(metadata.acceptEmptyValueForSelectField)?metadata.acceptEmptyValueForSelectField:true;};utilityFunctions.addReadOnlyProperty(that,'acceptEmptyValueForSelectField',acceptEmptyValueForSelectField);function getMaxLength(){return metadata.maxLength;}
utilityFunctions.addReadOnlyProperty(that,'maxLength',getMaxLength);function isNumeric(){return metadata.isNumeric;}
utilityFunctions.addReadOnlyProperty(that,'isNumeric',isNumeric);function isCurrency(){return metadata.isCurrency;}
utilityFunctions.addReadOnlyProperty(that,'isCurrency',isCurrency);function hasBlankString(){return metadata.hasBlankString;}
utilityFunctions.addReadOnlyProperty(that,'hasBlankString',hasBlankString);function getBlankString(){return metadata.blankString}
utilityFunctions.addReadOnlyProperty(that,'blankString',getBlankString);function hasMinValue(){return metadata.hasOwnProperty("minValue");}
utilityFunctions.addReadOnlyProperty(that,'hasMinValue',hasMinValue);function getMinValue(){return metadata.minValue;}
utilityFunctions.addReadOnlyProperty(that,'minValue',getMinValue);function hasMaxValue(){return metadata.hasOwnProperty("maxValue");}
utilityFunctions.addReadOnlyProperty(that,'hasMaxValue',hasMaxValue);function getMaxValue(){return metadata.maxValue;}
utilityFunctions.addReadOnlyProperty(that,'maxValue',getMaxValue);function getValidationFieldType(){return metadata.validationTypeField;}
utilityFunctions.addReadOnlyProperty(that,'fieldTypeForValidation',getValidationFieldType);function getDefaultFieldState(){return util.extend({},defaultFieldStates);}
utilityFunctions.addReadOnlyProperty(that,'defaultFieldState',getDefaultFieldState);function getSlavingMetadata(){return metadata.hasOwnProperty('slavingMetadata')?metadata.slavingMetadata:null;}
utilityFunctions.addReadOnlyProperty(that,'slavingMetadata',getSlavingMetadata);function getClientSlavingMetadata(){return metadata.clientSlavingMetadata;}
utilityFunctions.addReadOnlyProperty(that,'clientSlavingMetadata',getClientSlavingMetadata);function getFieldScripts(){return metadata.fieldScript;}
utilityFunctions.addReadOnlyProperty(that,'fieldScripts',getFieldScripts);function getFieldScript(scriptType)
{if(metadata.hasOwnProperty('fieldScript')&&metadata['fieldScript'].hasOwnProperty(scriptType))
return metadata['fieldScript'][scriptType];else
return null;}
this.getFieldScript=getFieldScript;function getOptionMastersAndAuxFields(){return metadata.optionMastersAndAuxFields;}
utilityFunctions.addReadOnlyProperty(that,'optionMastersAndAuxFields',getOptionMastersAndAuxFields);function getSubrecordType()
{return(metadata.type==='summary'&&metadata.hasOwnProperty('subrecordType'))?metadata.subrecordType:null;}
utilityFunctions.addReadOnlyProperty(that,'subrecordType',getSubrecordType);function getSubrecordIdField()
{return(metadata.type==='summary'&&metadata.hasOwnProperty('subrecordIdField'))?metadata.subrecordIdField:null;}
utilityFunctions.addReadOnlyProperty(that,'subrecordIdField',getSubrecordIdField);function getSubrecordCompatibilityMap()
{return(metadata.type==='summary'&&metadata.hasOwnProperty('subrecordCompatibilityMap'))?metadata.subrecordCompatibilityMap:null;}
utilityFunctions.addReadOnlyProperty(that,'subrecordCompatibilityMap',getSubrecordCompatibilityMap);function getSubrecordInitialParameters()
{return(metadata.type==='summary'&&metadata.hasOwnProperty('subrecordInitialParameters'))?metadata.subrecordInitialParameters:null;}
utilityFunctions.addReadOnlyProperty(that,'subrecordInitialParameters',getSubrecordInitialParameters);this.on=emitter.on;this.off=emitter.off;function toJSON()
{var copy=util.extend({},metadata);return copy;}
return this;}
Object.freeze(FieldLevelMetadata);return{create:function create(options){return new FieldLevelMetadata(options);}};});define('N/record/sublistLevelMetadataEvent',['N/record/fieldLevelMetadataEvent'],function(fieldLevelMetadataEvent)
{var EVENT_TYPE=Object.freeze({FIELD_METADATA_LABEL_CHANGE:'FIELD_METADATA_LABEL_CHANGE'});var translateFieldLevelMetadataEventTypeToSublistLevelMetadataEventType=(function(){var eventTranslations={};eventTranslations[fieldLevelMetadataEvent.Type.LABEL_CHANGE]=EVENT_TYPE.FIELD_METADATA_LABEL_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function translateFieldLevelMetadataEventToSublistLevelMetadataEvent(sublistLevelMetadata,fieldLevelMetadataEvent)
{return addFieldLevelMetadataEventDetails(getEvent(sublistLevelMetadata,translateFieldLevelMetadataEventTypeToSublistLevelMetadataEventType(fieldLevelMetadataEvent.type)),fieldLevelMetadataEvent);}
function addFieldLevelMetadataEventDetails(event,fieldLevelMetadataEvent)
{event.fieldId=fieldLevelMetadataEvent.fieldLevelMetadata.name;if(fieldLevelMetadataEvent.oldValue!==undefined){event.oldValue=fieldLevelMetadataEvent.oldValue;}
if(fieldLevelMetadataEvent.newValue!==undefined){event.newValue=fieldLevelMetadataEvent.newValue;}
return event;}
function getEvent(sublistLevelMetadata,type)
{return{type:type,sublistLevelMetadata:sublistLevelMetadata};}
function emit(emitter,sublistState,type)
{emitter.emit(getEvent(sublistState,type));}
function forwardFieldLevelMetadataEvent(emitter,sublistLevelMetadata,fieldLevelMetadataEvent)
{emitter.emit(translateFieldLevelMetadataEventToSublistLevelMetadataEvent(sublistLevelMetadata,fieldLevelMetadataEvent));}
function forwardFieldLevelMetadataEvents(emitter,sublistLevelMetadata,fieldLevelMetadata)
{var forward=forwardFieldLevelMetadataEvent.bind(null,emitter,sublistLevelMetadata);fieldLevelMetadata.on({types:[fieldLevelMetadataEvent.Type.LABEL_CHANGE],listener:forward});}
return Object.freeze({Type:EVENT_TYPE,emit:emit,forwardFieldLevelMetadataEvents:forwardFieldLevelMetadataEvents});});define('N/record/sublistLevelMetadata',['N/utilityFunctions','N/record/sublistLevelMetadataEvent','N/eventEmitter'],function(utilityFunctions,sublistLevelMetadataEvent,eventEmitter){function SublistLevelMetadata(options)
{var that=this;var sublistMetadataObj=options.sublistMetadataObj;var fieldMetadata=options.fieldMetadatas;var name=sublistMetadataObj.name;var type=sublistMetadataObj.type;var nlobjSublistType=sublistMetadataObj.nlobjSublistType;var isScriptableMachine=sublistMetadataObj.isScriptableMachine;var isSublistEditable=sublistMetadataObj.isEditable;var sortedFields=sublistMetadataObj.sortedFields||[];var noCopyFields=sublistMetadataObj.noCopyFields||[];var backwardCompatibleFields=sublistMetadataObj.backwardCompatibleFields;var scripts=sublistMetadataObj.sublistScript||{};var defaultValues=sublistMetadataObj.defaultValues||{};var isSublistDisplayOnly=sublistMetadataObj.displayOnly||false;var isSublistMultilineEditable=sublistMetadataObj.isMultilineEditable||false;var emitter=eventEmitter.create();Object.keys(fieldMetadata).forEach(function(fieldId){var metadata=fieldMetadata[fieldId];sublistLevelMetadataEvent.forwardFieldLevelMetadataEvents(emitter,that,metadata);});function getName(){return name}
utilityFunctions.addReadOnlyProperty(this,'name',getName);function getType(){return type}
utilityFunctions.addReadOnlyProperty(this,'type',getType);function getSortedFields(){return sortedFields;}
utilityFunctions.addReadOnlyProperty(this,'sortedFields',getSortedFields);function getNoCopyFields(){return noCopyFields;}
utilityFunctions.addReadOnlyProperty(this,'noCopyFields',getNoCopyFields);function getBackwardCompatibilityFieldNamesForSubrecord(){return backwardCompatibleFields;}
utilityFunctions.addReadOnlyProperty(this,'backwardCompatibilityFieldNamesForSubrecord',getBackwardCompatibilityFieldNamesForSubrecord);function getNlobjSublistConstructorType(){return nlobjSublistType;}
utilityFunctions.addReadOnlyProperty(this,'nlobjSublistConstructorType',getNlobjSublistConstructorType);function getIsScriptableMachine(){return isScriptableMachine;}
utilityFunctions.addReadOnlyProperty(this,'isScriptableMachine',getIsScriptableMachine);function getIsSublistEditable(){return isSublistEditable;}
utilityFunctions.addReadOnlyProperty(this,'isEditable',getIsSublistEditable);function getSublistScripts(scriptingTrigger)
{var result=null;if(scriptingTrigger===undefined)
{result=scripts;}
else if(scripts.hasOwnProperty(scriptingTrigger))
{result=scripts[scriptingTrigger];}
return result;}
this.getSublistScripts=getSublistScripts;function getSublistDefaultValue()
{return util.extend({},defaultValues);}
utilityFunctions.addReadOnlyProperty(this,'defaultValue',getSublistDefaultValue);function getDefaultSublistState()
{return util.extend({},sublistMetadataObj.sublistState);}
utilityFunctions.addReadOnlyProperty(this,'defaultState',getDefaultSublistState);function getFieldMetadatas()
{return fieldMetadata}
utilityFunctions.addReadOnlyProperty(this,'fieldMetadata',getFieldMetadatas);function getFieldMetadata(fieldId)
{return fieldMetadata.hasOwnProperty(fieldId)?fieldMetadata[fieldId]:null;}
this.getFieldMetadata=getFieldMetadata;function isRecalcDeferred()
{return sublistMetadataObj.isRecalcDeferred;}
utilityFunctions.addReadOnlyProperty(this,'isRecalcDeferred',isRecalcDeferred);function isDisplayOnly()
{return isSublistDisplayOnly;}
utilityFunctions.addReadOnlyProperty(this,'displayOnly',isDisplayOnly);function isMultilineEditable()
{return isSublistMultilineEditable;}
utilityFunctions.addReadOnlyProperty(this,'isMultilineEditable',isMultilineEditable);this.on=emitter.on;this.off=emitter.off;return this;}
Object.freeze(SublistLevelMetadata);return{create:function create(options){return new SublistLevelMetadata(options);}};});define('N/record/metadataEvent',['N/record/fieldLevelMetadataEvent','N/record/sublistLevelMetadataEvent'],function(fieldLevelMetadataEvent,sublistLevelMetadataEvent)
{var EVENT_TYPE=Object.freeze({FIELD_METADATA_LABEL_CHANGE:'FIELD_METADATA_LABEL_CHANGE'});function getEvent(metadata,type)
{return{type:type,metadata:metadata};}
var translateFieldLevelMetadataEventTypeToMetadataEventType=(function(){var eventTranslations={};eventTranslations[fieldLevelMetadataEvent.Type.LABEL_CHANGE]=EVENT_TYPE.FIELD_METADATA_LABEL_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function translateFieldLevelMetadataEventToMetadataEvent(metadata,fieldLevelMetadataEvent)
{return addFieldLevelMetadataEventDetails(getEvent(metadata,translateFieldLevelMetadataEventTypeToMetadataEventType(fieldLevelMetadataEvent.type)),fieldLevelMetadataEvent);}
function addFieldLevelMetadataEventDetails(event,fieldLevelMetadataEvent)
{event.fieldId=fieldLevelMetadataEvent.fieldLevelMetadata.name;return event;}
function forwardFieldLevelMetadataEvent(emitter,metadata,fieldLevelMetadataEvent)
{emitter.emit(translateFieldLevelMetadataEventToMetadataEvent(metadata,fieldLevelMetadataEvent));}
function forwardFieldLevelMetadataEvents(emitter,metadata,fieldLevelMetadata)
{var forward=forwardFieldLevelMetadataEvent.bind(null,emitter,metadata);fieldLevelMetadata.on({types:[fieldLevelMetadataEvent.Type.LABEL_CHANGE],listener:forward});}
var translateSublistLevelMetadataEventTypeToMetadataEventType=(function(){var eventTranslations={};eventTranslations[sublistLevelMetadataEvent.Type.FIELD_METADATA_LABEL_CHANGE]=EVENT_TYPE.FIELD_METADATA_LABEL_CHANGE;return function(sublistLevelMetadataEventType){return eventTranslations[sublistLevelMetadataEventType];}}());function translateSublistLevelMetadataEventToMetadataEvent(metadata,sublistLevelMetadataEvent)
{return addSublistLevelMetadataEventDetails(getEvent(metadata,translateSublistLevelMetadataEventTypeToMetadataEventType(sublistLevelMetadataEvent.type)),sublistLevelMetadataEvent);}
function addSublistLevelMetadataEventDetails(event,sublistLevelMetadataEvent)
{event.sublistId=sublistLevelMetadataEvent.sublistLevelMetadata.name;event.fieldId=sublistLevelMetadataEvent.fieldId;if(sublistLevelMetadataEvent.oldValue!==undefined){event.oldValue=sublistLevelMetadataEvent.oldValue;}
if(sublistLevelMetadataEvent.newValue!==undefined){event.newValue=sublistLevelMetadataEvent.newValue;}
return event;}
function forwardSublistLevelMetadataEvent(emitter,metadata,sublistLevelMetadataEvent)
{emitter.emit(translateSublistLevelMetadataEventToMetadataEvent(metadata,sublistLevelMetadataEvent));}
function forwardSublistLevelMetadataEvents(emitter,metadata,sublistLevelMetadata)
{var forward=forwardSublistLevelMetadataEvent.bind(null,emitter,metadata);sublistLevelMetadata.on({types:[sublistLevelMetadataEvent.Type.FIELD_METADATA_LABEL_CHANGE],listener:forward});}
function emit(emitter,metadata,type)
{emitter.emit(getEvent(metadata,type));}
return Object.freeze({Type:EVENT_TYPE,emit:emit,forwardFieldLevelMetadataEvents:forwardFieldLevelMetadataEvents,forwardSublistLevelMetadataEvents:forwardSublistLevelMetadataEvents});});define('N/record/metadata',['N/utilityFunctions','N/record/recordUtilityFunctions','N/record/fieldLevelMetadata','N/record/sublistLevelMetadata','N/record/metadataEvent','N/eventEmitter'],function(utilityFunctions,recordUtil,fieldLevelMetadata,sublistLevelMetadata,metadataEvent,eventEmitter){function Metadata(metadataObj)
{var that=this;var type,queryUrl,sortedFields,sortedSublists,libraryScript,staticScript,uiFormScript,workflowScript;var fieldIds,sublistIds,sublistFieldIds,fieldMetadata,sublistMetadata;var emitter=eventEmitter.create();(function constructor(metadataObj){type=metadataObj.type;queryUrl=metadataObj.queryUrl;sortedFields=metadataObj.sortedFields;sortedSublists=metadataObj.sortedSublist;libraryScript=metadataObj.libraryScript;staticScript=metadataObj.staticScript;uiFormScript=metadataObj.uiFormScript;workflowScript=metadataObj.workflowScript;fieldIds=[];sublistIds=[];sublistFieldIds={};fieldMetadata={};sublistMetadata={};(function setFieldMetadata(fieldLevelMetadataObjs){recordUtil.forEachProperty(fieldLevelMetadataObjs,function(fieldId,metadataJSON)
{fieldIds[fieldIds.length]=fieldId;});utilityFunctions.freezeObjectIfPossible(fieldIds);})(metadataObj.bodyField);(function setSublistFieldMetadata(sublistLevelMetadataObjs){recordUtil.forEachProperty(sublistLevelMetadataObjs,function(sublistId,sublistLevelMetadataObj){sublistIds[sublistIds.length]=sublistId;var fieldmetadataJSON=sublistLevelMetadataObj.fieldMetadata;var fieldLevelMetadatas={};sublistFieldIds[sublistId]=[];recordUtil.forEachProperty(fieldmetadataJSON,function(fieldId,metadataJSON)
{sublistFieldIds[sublistId].push(fieldId);fieldLevelMetadatas[fieldId]=fieldLevelMetadata.create(metadataJSON);});var metadata=sublistLevelMetadata.create({sublistMetadataObj:sublistLevelMetadataObj,fieldMetadatas:fieldLevelMetadatas});metadataEvent.forwardSublistLevelMetadataEvents(emitter,that,metadata);sublistMetadata[sublistId]=metadata;});utilityFunctions.freezeObjectIfPossible(sublistIds);})(metadataObj.sublist);})(metadataObj);function getType(){return type;}
utilityFunctions.addReadOnlyProperty(this,'type',getType);function getQueryUrl(){return queryUrl;}
utilityFunctions.addReadOnlyProperty(this,'queryUrl',getQueryUrl);function getLibraryScript(){return libraryScript;}
utilityFunctions.addReadOnlyProperty(this,'libraryScript',getLibraryScript);function getStaticScript(){return staticScript;}
utilityFunctions.addReadOnlyProperty(this,'staticScript',getStaticScript);function getUIFormScript(){return uiFormScript;}
utilityFunctions.addReadOnlyProperty(this,'uiFormScript',getUIFormScript);function getWorkflowScript(){return workflowScript;}
utilityFunctions.addReadOnlyProperty(this,'workflowScript',getWorkflowScript);function getNoCopyFields(){return sortedFields;}
utilityFunctions.addReadOnlyProperty(this,'noCopyFields',getNoCopyFields);function getSortedFields(){return sortedFields;}
utilityFunctions.addReadOnlyProperty(this,'sortedFields',getSortedFields);function getSortedSublists(){return sortedSublists;}
utilityFunctions.addReadOnlyProperty(this,'sortedSublists',getSortedSublists);function getAllFieldNames(){return fieldIds;}
utilityFunctions.addReadOnlyProperty(this,'fieldIds',getAllFieldNames);function isValidField(fieldId)
{return getAllFieldNames().indexOf(fieldId)>-1;}
this.isValidField=isValidField;function getAllSubrecordFields()
{return getAllFieldNames().filter(function(v,i,a){var fieldId=v;return getFieldMetadata(null,fieldId)&&getFieldMetadata(null,fieldId).type===recordUtil.FIELD_TYPE.SUBRECORD_FIELD_TYPE;});}
utilityFunctions.addReadOnlyProperty(this,'subrecordFieldIds',getAllSubrecordFields);function getSublistFieldMetadata(sublistId,fieldId)
{return sublistMetadata.hasOwnProperty(sublistId)?sublistMetadata[sublistId].getFieldMetadata(fieldId):null;}
function getFieldMetadata(sublistId,fieldId)
{if(sublistId)
return getSublistFieldMetadata(sublistId,fieldId);var metadata=null;if(fieldMetadata.hasOwnProperty(fieldId))
metadata=fieldMetadata[fieldId];else if(metadataObj.bodyField.hasOwnProperty(fieldId))
{metadata=fieldLevelMetadata.create(metadataObj.bodyField[fieldId]);metadataEvent.forwardSublistLevelMetadataEvents(emitter,that,metadata);fieldMetadata[fieldId]=metadata;}
return metadata;}
this.getFieldMetadata=getFieldMetadata;function isValidSublist(sublistId)
{return sublistMetadata.hasOwnProperty(sublistId);}
this.isValidSublist=isValidSublist;function getSublistMetadata(sublistId)
{return sublistMetadata.hasOwnProperty(sublistId)?sublistMetadata[sublistId]:null;}
this.getSublistMetadata=getSublistMetadata;function getSublistType(sublistId)
{var metadata=getSublistMetadata(sublistId);return(metadata)?metadata.type:null;}
this.getSublistType=getSublistType;function getSublists(){return sublistIds;}
utilityFunctions.addReadOnlyProperty(this,'sublistIds',getSublists);function isValidSublistField(sublistId,fieldId)
{var sublistfields=getAllSublistFields(sublistId);return(sublistfields!=null&&sublistfields.indexOf(fieldId)>-1);}
this.isValidSublistField=isValidSublistField;function getAllSublistFields(sublistId)
{return sublistFieldIds[sublistId]||[];}
this.getAllSublistFields=getAllSublistFields;function getAllSublistSubrecordFields(sublistId)
{var sublistFields=sublistFieldIds[sublistId]||[];sublistFields=sublistFields.filter(function(v,i,a){var fieldId=v;return getSublistFieldMetadata(sublistId,fieldId)&&getSublistFieldMetadata(sublistId,fieldId).type===recordUtil.FIELD_TYPE.SUBRECORD_FIELD_TYPE;});return sublistFields;}
this.getAllSublistSubrecordFields=getAllSublistSubrecordFields;function getSublistScripts(sublistName,scriptingTrigger)
{var metadata=getSublistMetadata(sublistName);return(metadata)?metadata.getSublistScripts(scriptingTrigger):null;}
this.getSublistScripts=getSublistScripts;function getSublistDefaultValue(sublistId)
{var metadata=getSublistMetadata(sublistId);return(metadata)?metadata.defaultValue:{};}
this.getSublistDefaultValue=getSublistDefaultValue;function toJSON()
{return metadataObj;}
function clone()
{return new Metadata(toJSON());}
this.clone=clone;this.on=emitter.on;this.off=emitter.off;return this;}
return{create:function(metadataObj){return new Metadata(metadataObj);},isInstance:function(obj){return obj instanceof Metadata;}};});define('N/record/fieldStateEvent',[],function()
{var EVENT_TYPE=Object.freeze({PARENT_STATE_CHANGE:'PARENT_STATE_CHANGE',USE_TEXT_API_CHANGE:'USE_TEXT_API_CHANGE',IS_PARSED_CHANGE:'IS_PARSED_CHANGE',IS_MANDATORY_CHANGE:'IS_MANDATORY_CHANGE',IS_HIDDEN_CHANGE:'IS_HIDDEN_CHANGE',IS_DISABLED_CHANGE:'IS_DISABLED_CHANGE',IS_VISIBLE_CHANGE:'IS_VISIBLE_CHANGE',IS_DISPLAY_CHANGE:'IS_DISPLAY_CHANGE',IS_READ_ONLY_CHANGE:'IS_READ_ONLY_CHANGE',IGNORE_SLAVING_CHANGE:'IGNORE_SLAVING_CHANGE',IS_CHANGED_CHANGE:'IS_CHANGED_CHANGE',LABEL_CHANGE:'LABEL_CHANGE'});function getEvent(fieldState,type)
{return{type:type,fieldState:fieldState};}
function addValues(event,oldValue,newValue)
{if(oldValue!==undefined){event.oldValue=oldValue;}
if(newValue!==undefined){event.newValue=newValue;}
return event;}
function emit(emitter,fieldState,type,oldValue,newValue)
{emitter.emit(addValues(getEvent(fieldState,type),oldValue,newValue));}
return Object.freeze({Type:EVENT_TYPE,emit:emit});});define('N/record/fieldState',['N/record/fieldStateEvent','N/eventEmitter'],function(fieldStateEvent,eventEmitter){function FieldState(options)
{var that=this;var parentState=options.parentState;var fs=options.fieldState;var id=fs.name||'';var label=fs.label||'';var shouldUseTextApi=false;var isParsed=fs&&!!(fs.isParsed);var isFieldMandatory=fs.isMandatory||false;var defaultMandatory=fs.isDefaultMandatory||false;var isFieldHidden=fs.isHidden||false;var isFieldDisabled=fs.isDisabled||false;var isFieldReadOnly=fs.isReadOnly||false;var ignoreSlaving=fs.noSlaving||false;var isFieldChanged=fs.isChanged||false;var isFieldVisible=fs.isVisible||true;var isFieldDisplay=fs.isDisplay||true;var emitter=eventEmitter.create();Object.defineProperty(this,'parentState',{get:function()
{return parentState;},set:function(state)
{if(parentState!==state)
{parentState=state;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.PARENT_STATE_CHANGE);}},enumerable:true,configurable:false});Object.defineProperty(this,'useTextApi',{get:function()
{return shouldUseTextApi;},set:function(val)
{if(util.isBoolean(val)&&(shouldUseTextApi!==val))
{var oldValue=shouldUseTextApi;shouldUseTextApi=val;var newValue=shouldUseTextApi;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.USE_TEXT_API_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isParsed',{get:function()
{return isParsed;},set:function(val)
{if(util.isBoolean(val)&&(isParsed!==val))
{var oldValue=isParsed;isParsed=val;var newValue=isParsed;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_PARSED_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isMandatory',{get:function()
{return isFieldMandatory;},set:function(val){if(util.isBoolean(val)&&(isFieldMandatory!==val))
{var oldValue=isFieldMandatory;isFieldMandatory=val;var newValue=isFieldMandatory;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_MANDATORY_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isDefaultMandatory',{get:function()
{return defaultMandatory;},enumerable:true,configurable:false});Object.defineProperty(this,'isHidden',{get:function()
{return isFieldHidden;},set:function(val)
{if(util.isBoolean(val)&&(isFieldHidden!==val))
{var oldValue=isFieldHidden;isFieldHidden=val;var newValue=isFieldHidden;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_HIDDEN_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isDisabled',{get:function()
{return isFieldDisabled;},set:function(val)
{if(util.isBoolean(val)&&(isFieldDisabled!==val))
{var oldValue=isFieldDisabled;isFieldDisabled=val;var newValue=isFieldDisabled;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_DISABLED_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isVisible',{get:function()
{return isFieldVisible;},set:function(val)
{if(util.isBoolean(val)&&(isFieldVisible!==val))
{var oldValue=isFieldVisible;isFieldVisible=val;var newValue=isFieldVisible;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_VISIBLE_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isDisplay',{get:function()
{return isFieldDisplay;},set:function(val)
{if(util.isBoolean(val)&&(isFieldDisplay!==val))
{var oldValue=isFieldDisplay;isFieldDisplay=val;var newValue=isFieldDisplay;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_DISPLAY_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isReadOnly',{get:function()
{return isFieldReadOnly;},set:function(val)
{if(util.isBoolean(val)&&(isFieldReadOnly!==val))
{var oldValue=isFieldReadOnly;isFieldReadOnly=val;var newValue=isFieldReadOnly;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_READ_ONLY_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'ignoreSlaving',{get:function()
{return ignoreSlaving;},set:function(val)
{if(util.isBoolean(val)&&(ignoreSlaving!==val))
{var oldValue=ignoreSlaving;ignoreSlaving=val;var newValue=ignoreSlaving;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IGNORE_SLAVING_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isChanged',{get:function()
{return isFieldChanged;},set:function(val)
{if(util.isBoolean(val)&&(isFieldChanged!==val))
{var oldValue=isFieldChanged;isFieldChanged=val;var newValue=isFieldChanged;if(val===true&&parentState)
{parentState.isChanged=val;}
fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.IS_CHANGED_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function()
{return label;},set:function(val)
{if(label!==val)
{var oldValue=label;label=val;var newValue=label;fieldStateEvent.emit(emitter,that,fieldStateEvent.Type.LABEL_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'id',{get:function()
{return id;},set:function(val)
{id=val;},enumerable:true,configurable:false});this.on=emitter.on;this.off=emitter.off;return this;}
Object.freeze(FieldState);return Object.freeze({create:function(options){return new FieldState(options);},clone:function(fieldState)
{return new FieldState({parentState:fieldState.parentState,fieldState:{name:fieldState.id,label:fieldState.label,isMandatory:fieldState.isMandatory,isDefaultMandatory:fieldState.isDefaultMandatory,isHidden:fieldState.isHidden,isDisabled:fieldState.isDisabled,isReadOnly:fieldState.isReadOnly,noSlaving:fieldState.ignoreSlaving,isChanged:fieldState.isChanged,isVisible:fieldState.isVisible,isDisplay:fieldState.isDisplay,isParsed:fieldState.isParsed}});},createBasedOnFieldLevelMetadata:function(options){var parentState=options.parentState;var metadata=options.metadata;return new FieldState({parentState:parentState,fieldState:metadata.defaultFieldState});}})});define('N/record/sublistLineStateEvent',[],function()
{var EVENT_TYPE=Object.freeze({LINE_NUM_CHANGE:'LINE_NUM_CHANGE',IS_INSERTED_CHANGE:'IS_INSERTED_CHANGE',FIELD_STATE_ADDED:'FIELD_STATE_ADDED',FIELD_STATE_REMOVED:'FIELD_STATE_REMOVED'});function getEvent(sublistLineState,type)
{return{type:type,sublistLineState:sublistLineState};}
function emit(emitter,sublistLineState,type)
{emitter.emit(getEvent(sublistLineState,type));}
return Object.freeze({Type:EVENT_TYPE,emit:emit});});define('N/record/sublistLineState',['N/utilityFunctions','N/record/fieldState','N/record/sublistLineStateEvent','N/eventEmitter'],function(utilityFunctions,fieldState,sublistLineStateEvent,eventEmitter)
{function addFieldId(obj,fieldId)
{obj.fieldId=fieldId;return obj;}
function SublistLineState(options)
{var that=this;var fieldStates=options.fieldStates;var originalLine=options.line||options.line===0?options.line:-1;var isInsertedLine=false;var emitter=eventEmitter.create();Object.defineProperty(this,'lineNum',{get:function()
{return originalLine;},set:function(line)
{if(originalLine!==line)
{originalLine=line;sublistLineStateEvent.emit(emitter,that,sublistLineStateEvent.Type.LINE_NUM_CHANGE);}},enumerable:true,configurable:false});Object.defineProperty(this,'isInserted',{get:function()
{return isInsertedLine;},set:function(val)
{if(isInsertedLine!==val)
{isInsertedLine=val;sublistLineStateEvent.emit(emitter,that,sublistLineStateEvent.Type.IS_INSERTED_CHANGE);}},enumerable:true,configurable:false});Object.defineProperty(this,'isChanged',{get:function()
{for(var fieldId in fieldStates)
{if(fieldStates.hasOwnProperty(fieldId)&&fieldStates[fieldId].isChanged)
return true;}
return false;},enumerable:true,configurable:false});function hasFieldState(fieldId)
{return fieldStates.hasOwnProperty(fieldId);}
this.hasFieldState=hasFieldState;function removeFieldState(fieldId)
{if(fieldStates.hasOwnProperty(fieldId))
{delete fieldStates[fieldId];sublistLineStateEvent.emit(emitter,that,sublistLineStateEvent.Type.FIELD_STATE_REMOVED);}}
this.removeFieldState=removeFieldState;function getFieldState(fieldId)
{return fieldStates[fieldId];}
this.getFieldState=getFieldState;function addFieldState(fieldId,state)
{fieldStates[fieldId]=state;sublistLineStateEvent.emit(emitter,that,sublistLineStateEvent.Type.FIELD_STATE_ADDED);}
this.addFieldState=addFieldState;function getClonedFieldStates()
{var returnFieldStates={};for(var fieldId in fieldStates)
{if(fieldStates.hasOwnProperty(fieldId))
returnFieldStates[fieldId]=fieldState.clone(fieldStates[fieldId]);}
return returnFieldStates;}
this.getClonedFieldStates=getClonedFieldStates;this.on=emitter.on;this.off=emitter.off;return this;}
utilityFunctions.freezeObjectIfPossible(SublistLineState);return Object.freeze({create:function(options)
{return new SublistLineState(options);}});});define('N/record/sublistStateEvent',['N/record/fieldStateEvent'],function(fieldStateEvent)
{var EVENT_TYPE=Object.freeze({IS_DISPLAY_CHANGE:'IS_DISPLAY_CHANGE',IS_CHANGED_CHANGE:'IS_CHANGED_CHANGE',IS_HIDDEN_CHANGE:'IS_HIDDEN_CHANGE',FIELD_IS_MANDATORY_CHANGE:'FIELD_IS_MANDATORY_CHANGE',FIELD_IS_HIDDEN_CHANGE:'FIELD_IS_HIDDEN_CHANGE',FIELD_IS_DISABLED_CHANGE:'FIELD_IS_DISABLED_CHANGE',FIELD_IS_VISIBLE_CHANGE:'FIELD_IS_VISIBLE_CHANGE',FIELD_IS_DISPLAY_CHANGE:'FIELD_IS_DISPLAY_CHANGE',FIELD_IS_READ_ONLY_CHANGE:'FIELD_IS_READ_ONLY_CHANGE',FIELD_LABEL_CHANGE:'FIELD_LABEL_CHANGE'});var translateFieldStateEventTypeToSublistStateEventType=(function(){var eventTranslations={};eventTranslations[fieldStateEvent.Type.IS_MANDATORY_CHANGE]=EVENT_TYPE.FIELD_IS_MANDATORY_CHANGE;eventTranslations[fieldStateEvent.Type.IS_HIDDEN_CHANGE]=EVENT_TYPE.FIELD_IS_HIDDEN_CHANGE;eventTranslations[fieldStateEvent.Type.IS_DISABLED_CHANGE]=EVENT_TYPE.FIELD_IS_DISABLED_CHANGE;eventTranslations[fieldStateEvent.Type.IS_VISIBLE_CHANGE]=EVENT_TYPE.FIELD_IS_VISIBLE_CHANGE;eventTranslations[fieldStateEvent.Type.IS_DISPLAY_CHANGE]=EVENT_TYPE.FIELD_IS_DISPLAY_CHANGE;eventTranslations[fieldStateEvent.Type.IS_READ_ONLY_CHANGE]=EVENT_TYPE.FIELD_IS_READ_ONLY_CHANGE;eventTranslations[fieldStateEvent.Type.LABEL_CHANGE]=EVENT_TYPE.FIELD_LABEL_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function translateFieldStateEventToSublistStateEvent(sublistState,fieldStateEvent)
{return addFieldStateEventDetails(getEvent(sublistState,translateFieldStateEventTypeToSublistStateEventType(fieldStateEvent.type)),fieldStateEvent);}
function addFieldStateEventDetails(event,fieldStateEvent)
{var lineFieldStateLocation=event.sublistState.findLineForFieldState(fieldStateEvent.fieldState);event.fieldId=fieldStateEvent.fieldState.id;if(fieldStateEvent.oldValue!==undefined){event.oldValue=fieldStateEvent.oldValue;}
if(fieldStateEvent.newValue!==undefined){event.newValue=fieldStateEvent.newValue;}
event.line=lineFieldStateLocation.line;event.currentLine=lineFieldStateLocation.current;return event;}
function getEvent(sublistState,type)
{return{type:type,sublistState:sublistState};}
function addValues(event,oldValue,newValue)
{if(oldValue!==undefined){event.oldValue=oldValue;}
if(newValue!==undefined){event.newValue=newValue;}
return event;}
function emit(emitter,sublistState,type,oldValue,newValue)
{emitter.emit(addValues(getEvent(sublistState,type),oldValue,newValue));}
function forwardFieldStateEvent(emitter,sublistState,fieldStateEvent)
{emitter.emit(translateFieldStateEventToSublistStateEvent(sublistState,fieldStateEvent));}
function forwardFieldStateEvents(emitter,sublistState,fieldState)
{var forward=forwardFieldStateEvent.bind(null,emitter,sublistState);fieldState.on({types:[fieldStateEvent.Type.IS_MANDATORY_CHANGE,fieldStateEvent.Type.IS_HIDDEN_CHANGE,fieldStateEvent.Type.IS_DISABLED_CHANGE,fieldStateEvent.Type.IS_VISIBLE_CHANGE,fieldStateEvent.Type.IS_DISPLAY_CHANGE,fieldStateEvent.Type.IS_READ_ONLY_CHANGE,fieldStateEvent.Type.LABEL_CHANGE],listener:forward});}
return Object.freeze({Type:EVENT_TYPE,emit:emit,forwardFieldStateEvents:forwardFieldStateEvents});});define('N/record/sublistState',['N/utilityFunctions','N/error','N/record/fieldState','N/record/sublistLineState','N/record/sublistStateEvent','N/eventEmitter'],function(utilityFunctions,error,fieldState,sublistLineState,sublistStateEvent,eventEmitter){function SublistController()
{var that=this;var sublist={};function lineInstanceIdExists(lineInstanceId)
{return sublist.hasOwnProperty(lineInstanceId);}
function getLineInstanceIds()
{return Object.keys(sublist);}
this.getLineInstanceIds=getLineInstanceIds;function has(lineInstanceId)
{var result=false;var hasLineInstanceId=lineInstanceIdExists(lineInstanceId);if(hasLineInstanceId)
{result=!!sublist[lineInstanceId];}
return result;}
this.has=has;function get(lineInstanceId)
{var result=null;var hasLineInstanceId=lineInstanceIdExists(lineInstanceId);if(hasLineInstanceId)
{result=sublist[lineInstanceId];}
return result;}
this.get=get;function put(lineInstanceId,value)
{var previousValue=get(lineInstanceId);sublist[lineInstanceId]=value;return previousValue;}
this.put=put;function remove(lineInstanceId)
{var removedValue=get(lineInstanceId);delete sublist[lineInstanceId];return removedValue;}
this.remove=remove;}
function SublistState(options)
{var that=this;var id=options.id;var parentState=options.parentState;var sublistStateObj=options.sublistStateObj;var fieldMetadata=options.fieldMetadata;var getModelController=options.getModelController;var lineStatePrototype={};var lines=new SublistController();var lineBuffers=new SublistController();var allowsNewLine=sublistStateObj.allowAddlines||false;var isSublistChanged=false;var isSublistDisplay=sublistStateObj.isDisplay||true;var isSublistHidden=false;var isSublistMultilineEditable=options.isMultilineEditable||false;var emitter=eventEmitter.create();function checkIfMachineDoesNotAllowsChangeForInstance(lineInstanceId)
{var useBuffer=false;return!allowsNewLine&&!getModelController().isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer);}
function getSublistlines(useBuffer)
{return!useBuffer?lines:lineBuffers;}
function findLineForFieldState(fieldstate)
{var result={current:false,line:null};var fieldId=fieldstate.id;var modelController=getModelController();var lineInstanceId=null;var lineInstanceIds=null;var sublistLineState=null;var found=false;if(!found)
{lineInstanceIds=lineBuffers.getLineInstanceIds();for(var i=0;i<lineInstanceIds.length;i++)
{lineInstanceId=lineInstanceIds[i];sublistLineState=lineBuffers.get(lineInstanceId);if(!!sublistLineState&&sublistLineState.hasFieldState(fieldId)&&sublistLineState.getFieldState(fieldId)===fieldstate)
{found=true;result.current=true;result.line=modelController.getSublistLineValueForInstance(id,'_sequence',lineInstanceId,result.current);break;}}}
if(!found)
{lineInstanceIds=lines.getLineInstanceIds();for(var i=0;i<lineInstanceIds.length;i++)
{lineInstanceId=lineInstanceIds[i];sublistLineState=lines.get(lineInstanceId);if(sublistLineState.hasFieldState(fieldId)&&sublistLineState.getFieldState(fieldId)===fieldstate)
{found=true;result.current=false;result.line=modelController.getSublistLineValueForInstance(id,'_sequence',lineInstanceId,result.current);break;}}}
return result;}
this.findLineForFieldState=findLineForFieldState;(function constructor(fieldMetadata){lineStatePrototype={};for(var fieldId in fieldMetadata)
{if(fieldMetadata.hasOwnProperty(fieldId))
lineStatePrototype[fieldId]=fieldMetadata[fieldId].defaultFieldState;}}(fieldMetadata));Object.defineProperty(this,'id',{get:function()
{return id;},enumerable:true,configurable:false});Object.defineProperty(this,'allowsNewLine',{get:function()
{return allowsNewLine;},enumerable:true,configurable:false});Object.defineProperty(this,'isDisplay',{get:function()
{return isSublistDisplay;},set:function(val)
{if(util.isBoolean(val)&&(isSublistDisplay!==val))
{var oldValue=isSublistDisplay;isSublistDisplay=val;var newValue=isSublistDisplay;sublistStateEvent.emit(emitter,that,sublistStateEvent.Type.IS_DISPLAY_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isChanged',{get:function()
{return isSublistChanged;},set:function(val)
{if(util.isBoolean(val)&&(isSublistChanged!==val))
{var oldValue=isSublistChanged;isSublistChanged=val;var newValue=isSublistChanged;if(val===true&&parentState)
parentState.isChanged=true;sublistStateEvent.emit(emitter,that,sublistStateEvent.Type.IS_CHANGED_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});Object.defineProperty(this,'isHidden',{get:function()
{return isSublistHidden;},set:function(val)
{if(util.isBoolean(val)&&(isSublistHidden!==val))
{var oldValue=isSublistHidden;isSublistHidden=val;var newValue=isSublistHidden;sublistStateEvent.emit(emitter,that,sublistStateEvent.Type.IS_HIDDEN_CHANGE,oldValue,newValue);}},enumerable:true,configurable:false});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isMultilineEditable',function(){return isSublistMultilineEditable;});function getFieldLevelMetadata(fieldId)
{return fieldMetadata.hasOwnProperty(fieldId)?fieldMetadata[fieldId]:null;}
function createNewFieldState(lineState,fieldId)
{var fieldstate;var fieldLevelMetadata=getFieldLevelMetadata(fieldId);if(fieldLevelMetadata)
{fieldstate=fieldState.createBasedOnFieldLevelMetadata({metadata:fieldLevelMetadata});}
else
{var fsObj={name:fieldId,label:fieldId};addField(fieldId,fsObj);fieldstate=fieldState.create({fieldState:fsObj});}
sublistStateEvent.forwardFieldStateEvents(emitter,that,fieldstate);return fieldstate;}
function addField(fieldId,state)
{var fieldstate;lineBuffers.getLineInstanceIds().forEach(function(lineInstanceId){var fieldstate=fieldState.create({fieldState:{name:fieldId,label:fieldId}});sublistStateEvent.forwardFieldStateEvents(emitter,that,fieldstate);var thisLine=lineBuffers.get(lineInstanceId);if(thisLine!=null)
thisLine.addFieldState[fieldId]=fieldstate;});lines.getLineInstanceIds().forEach(function(lineInstanceId){var fieldstate=fieldState.create({fieldState:{name:fieldId,label:fieldId}});sublistStateEvent.forwardFieldStateEvents(emitter,that,fieldstate);lines.get(lineInstanceId).addFieldState[fieldId]=fieldstate;});lineStatePrototype[fieldId]=state;}
function removeFieldState(fieldId,line_0)
{var useBuffer=false;var lineInstanceId=getModelController().getSublistLineInstanceIdForLine(id,line_0,useBuffer);removeFieldStateForInstance(fieldId,lineInstanceId,useBuffer);}
this.removeFieldState=removeFieldState;function removeFieldStateForInstance(fieldId,lineInstanceId,useBuffer)
{var sublistlineState=getSublistlines(useBuffer).get(lineInstanceId);if(!!sublistlineState)
{sublistlineState.removeFieldState(fieldId);}}
this.removeFieldStateForInstance=removeFieldStateForInstance;function getFieldState(fieldId,line_0)
{var modelController=getModelController();var useBuffer=true;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);if(lineInstanceId===null)
{useBuffer=false;lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);}
return getFieldStateForInstance(fieldId,lineInstanceId,useBuffer);}
this.getFieldState=getFieldState;function getFieldStateForInstance(fieldId,lineInstanceId,useBuffer)
{var fieldState=null;var modelController=getModelController();var isLineInstanceValid=modelController.isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer);if(!isLineInstanceValid&&useBuffer)
{useBuffer=false;isLineInstanceValid=modelController.isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer);}
if(isLineInstanceValid)
{var sublistLines=getSublistlines(useBuffer);if(!sublistLines.has(lineInstanceId))
{insertLineForInstance(lineInstanceId,useBuffer,true);}
var sublistlineState=sublistLines.get(lineInstanceId);if(!sublistlineState.hasFieldState(fieldId))
{sublistlineState.addFieldState(fieldId,createNewFieldState(sublistlineState,fieldId));}
fieldState=sublistlineState.getFieldState(fieldId);}
else
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SUBLIST_OPERATION);}
return fieldState;}
this.getFieldStateForInstance=getFieldStateForInstance;function getLineStatePropotype(overwrittenDefaults)
{var prototype={};for(var fieldId in lineStatePrototype)
{if(lineStatePrototype.hasOwnProperty(fieldId))
prototype[fieldId]=util.extend({},lineStatePrototype[fieldId]);if(overwrittenDefaults)
{var fs=overwrittenDefaults[fieldId];for(var key in fs)
{if(fs.hasOwnProperty(key))
prototype[fieldId][key]=fs[key];}}}
return prototype;}
function createClonedLineState(line_0)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);return createClonedLineStateForInstance(lineInstanceId,useBuffer);}
function createClonedLineStateForInstance(lineInstanceId,useBuffer)
{var sublistlineStateClone=null;var modelController=getModelController();if(modelController.isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer))
{var sublistlines=getSublistlines(useBuffer);if(sublistlines.has(lineInstanceId))
{var sublistlineState=getSublistlines(useBuffer).get(lineInstanceId);sublistlineStateClone=sublistLineState.create({fieldStates:forwardFieldStateEventsOnClonedFieldStates(sublistlineState.getClonedFieldStates()),line:sublistlineState.lineNum});sublistlineStateClone.isInserted=sublistlineState.isInserted;sublistlineStateClone.isChanged=sublistlineState.isChanged;}
else
{sublistlineStateClone=sublistLineState.create({fieldStates:transformFieldPrototypesToFieldStates(getLineStatePropotype()),line:modelController.getSublistLineValueForInstance(id,'_sequence',lineInstanceId,true)});}}
return sublistlineStateClone;}
function doForwardFieldStateEvents(fieldStates,needToCreateFirst)
{return Object.keys(fieldStates).reduce(function(p,c){var fieldstate=needToCreateFirst?fieldState.create({fieldState:fieldStates[c]}):fieldStates[c];sublistStateEvent.forwardFieldStateEvents(emitter,that,fieldstate);p[c]=fieldstate;return p;},{});}
function forwardFieldStateEventsOnClonedFieldStates(fieldStates)
{return doForwardFieldStateEvents(fieldStates,false)}
function transformFieldPrototypesToFieldStates(fieldPrototypes)
{return doForwardFieldStateEvents(fieldPrototypes,true)}
function init()
{var modelController=getModelController();lines.getLineInstanceIds().forEach(function(lineInstanceId){lines.remove(lineInstanceId);});lineBuffers.getLineInstanceIds().forEach(function(lineInstanceId){lineBuffers.remove(lineInstanceId);});for(var i=0;i<modelController.getSublistLineCount(id);i++)
{var sublistFieldStates=modelController.getSublistFieldStates(id,i);var overwrittenDefaults=!!sublistFieldStates?sublistFieldStates:{};var fieldStates=transformFieldPrototypesToFieldStates(getLineStatePropotype(overwrittenDefaults));var linestate=sublistLineState.create({fieldStates:fieldStates,line:i});var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,i,useBuffer);lines.put(lineInstanceId,linestate);}}
this.init=init;function getAllFields()
{var fields=[];for(var fieldId in lineStatePrototype)
if(lineStatePrototype.hasOwnProperty(fieldId))
fields.push(fieldId);return fields;}
this.getAllFields=getAllFields;function getAllLineFields(line_0)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);return getAllLineFieldsForInstance(lineInstanceId,useBuffer);}
this.getAllLineFields=getAllLineFields;function getAllLineFieldsForInstance(lineInstanceId,useBuffer)
{var result=null,sublistlineState=getSublistlines(useBuffer).get(lineInstanceId);if(!!sublistlineState&&!!sublistlineState.getAllFields)
{result=sublistlineState.getAllFields();}
return result;}
this.getAllLineFieldsForInstance=getAllLineFieldsForInstance;function getCurrentLineFieldState(fieldId)
{var currentLineFieldState=null;var useBuffer=true;var modelController=getModelController();var lineInstanceId=modelController.getSublistSelectedLineInstanceId(id);if(lineInstanceId!==null)
{currentLineFieldState=getBufferLineFieldStateForInstance(fieldId,lineInstanceId,useBuffer);}
return currentLineFieldState;}
this.getCurrentLineFieldState=getCurrentLineFieldState;function getBufferLineFieldStateForInstance(fieldId,lineInstanceId,useBuffer)
{var fieldState=null;var modelController=getModelController();var isLineInstanceSelected=modelController.isSublistLineInstanceIdSelected(id,lineInstanceId);var isLineInstanceValid=modelController.isSublistLineInstanceIdSelected(id,lineInstanceId,useBuffer);if(isLineInstanceSelected||isLineInstanceValid)
{var sublistLines=getSublistlines(useBuffer);if(!sublistLines.has(lineInstanceId))
{resetBufferLineStateForInstance(lineInstanceId,useBuffer);}
var sublistlineState=sublistLines.get(lineInstanceId);if(!sublistlineState.hasFieldState(fieldId))
{sublistlineState.addFieldState(fieldId,createNewFieldState(sublistlineState,fieldId));}
fieldState=sublistlineState.getFieldState(fieldId);}
else
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SUBLIST_OPERATION);}
return fieldState;}
this.getBufferLineFieldStateForInstance=getBufferLineFieldStateForInstance;function removeCurrentLineState()
{var modelController=getModelController();var useBuffer=true;var lineInstanceId=modelController.getSublistSelectedLineInstanceId(id);removeSublistLineState(lineInstanceId,useBuffer);}
this.removeCurrentLineState=removeCurrentLineState;function removeSublistLineState(lineInstanceId,useBuffer)
{getSublistlines(useBuffer).remove(lineInstanceId);}
this.removeSublistLineState=removeSublistLineState;function resetCurrentLineState(currentLineIndex)
{var modelController=getModelController();var useBuffer=true;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,currentLineIndex,useBuffer);resetBufferLineStateForInstance(lineInstanceId,useBuffer)}
this.resetCurrentLineState=resetCurrentLineState;function resetBufferLineStateForInstance(lineInstanceId,useBuffer)
{var sublistlineState=null;removeBufferLineForInstance(lineInstanceId);if(useBuffer)
{sublistlineState=createClonedLineStateForInstance(lineInstanceId,false);}
if(!sublistlineState)
{sublistlineState=createClonedLineStateForInstance(lineInstanceId,useBuffer);}
getSublistlines(useBuffer).put(lineInstanceId,sublistlineState);}
this.resetBufferLineStateForInstance=resetBufferLineStateForInstance;function commitCurrentLine(currentLineIndex)
{var modelController=getModelController();var useBuffer=true;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,currentLineIndex,useBuffer);commitLineForInstance(lineInstanceId);}
this.commitCurrentLine=commitCurrentLine;function commitLineForInstance(lineInstanceId)
{var useBuffer=true;var modelController=getModelController();if(modelController.isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer))
{var sublistlineState=lineBuffers.remove(lineInstanceId);sublistlineState.isInserted=false;lines.put(lineInstanceId,sublistlineState);that.isChanged=true;}}
this.commitLineForInstance=commitLineForInstance;function insertLine(line_0,isInsert)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);insertLineForInstance(lineInstanceId,useBuffer,isInsert);}
this.insertLine=insertLine;function insertLineForInstance(lineInstanceId,useBuffer,isInsert)
{if(checkIfMachineDoesNotAllowsChangeForInstance(lineInstanceId))
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SUBLIST_OPERATION);var modelController=getModelController();if(modelController.isSublistLineInstanceIdValid(id,lineInstanceId,useBuffer))
{var sublistlineState=sublistLineState.create({fieldStates:transformFieldPrototypesToFieldStates(getLineStatePropotype())});sublistlineState.isInserted=!!isInsert;getSublistlines(useBuffer).put(lineInstanceId,sublistlineState);}}
this.insertLineForInstance=insertLineForInstance;function isLineInserted(line_0)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);return isLineInsertedForInstance(lineInstanceId,useBuffer);}
this.isLineInserted=isLineInserted;function isLineInsertedForInstance(lineInstanceId,useBuffer)
{var result=false;var sublistlines=getSublistlines(useBuffer);if(sublistlines.has(lineInstanceId))
{var sublistlineState=sublistlines.get(lineInstanceId);result=sublistlineState.isInserted;}
return result;}
this.isLineInsertedForInstance=isLineInsertedForInstance;function removeLine(line_0)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);removeLineForInstance(lineInstanceId);}
this.removeLine=removeLine;function removeBufferLineForInstance(lineInstanceId)
{if(checkIfMachineDoesNotAllowsChangeForInstance(lineInstanceId))
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SUBLIST_OPERATION);getSublistlines(true).remove(lineInstanceId);}
function removeLineForInstance(lineInstanceId)
{if(checkIfMachineDoesNotAllowsChangeForInstance(lineInstanceId))
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_SUBLIST_OPERATION);getSublistlines(true).remove(lineInstanceId);getSublistlines(false).remove(lineInstanceId);}
this.removeLineForInstance=removeLineForInstance;function isLineRemoved(line_0)
{var isNotRemoved=false;var lineInstanceIds=lines.getLineInstanceIds();var lineNum=parseInt(line_0,10);if(!isNaN(lineNum))
{var index=0;while(!isNotRemoved&&index<lineInstanceIds.length)
{var lineInstanceId=lineInstanceIds[index];isNotRemoved=lines.get(lineInstanceId).lineNum===lineNum;index+=1;}}
return!isNotRemoved;}
this.isLineRemoved=isLineRemoved;function isLineChanged(line_0)
{var modelController=getModelController();var useBuffer=false;var lineInstanceId=modelController.getSublistLineInstanceIdForLine(id,line_0,useBuffer);return isLineChangedForInstance(lineInstanceId,useBuffer);}
this.isLineChanged=isLineChanged;function isLineChangedForInstance(lineInstanceId,useBuffer)
{var result=false;var sublistlines=getSublistlines(useBuffer);if(sublistlines.has(lineInstanceId))
{var sublistlineState=sublistlines.get(lineInstanceId);result=sublistlineState.isChanged;}
return result;}
this.isLineChangedForInstance=isLineChangedForInstance;function getLineCount()
{return Object.keys(lines).length;}
this.getLineCount=getLineCount;this.on=emitter.on;this.off=emitter.off;return this;}
Object.freeze(SublistState);return Object.freeze({create:function(options){return new SublistState(options);}});});define('N/record/recordStateControllerEvent',['N/record/fieldStateEvent','N/record/sublistStateEvent'],function(fieldStateEvent,sublistStateEvent){var EVENT_TYPE=Object.freeze({FIELD_IS_MANDATORY_CHANGE:'FIELD_IS_MANDATORY_CHANGE',FIELD_IS_HIDDEN_CHANGE:'FIELD_IS_HIDDEN_CHANGE',FIELD_IS_DISABLED_CHANGE:'FIELD_IS_DISABLED_CHANGE',FIELD_IS_VISIBLE_CHANGE:'FIELD_IS_VISIBLE_CHANGE',FIELD_IS_DISPLAY_CHANGE:'FIELD_IS_DISPLAY_CHANGE',FIELD_IS_READ_ONLY_CHANGE:'FIELD_IS_READ_ONLY_CHANGE',FIELD_LABEL_CHANGE:'FIELD_LABEL_CHANGE',SUBLIST_IS_DISPLAY_CHANGE:'SUBLIST_IS_DISPLAY_CHANGE',SUBLIST_IS_HIDDEN_CHANGE:'SUBLIST_IS_HIDDEN_CHANGE'});function getEvent(type)
{return{type:type}}
var translateFieldStateEventTypeToRecordControllerEventType=(function(){var eventTranslations={};eventTranslations[fieldStateEvent.Type.IS_MANDATORY_CHANGE]=EVENT_TYPE.FIELD_IS_MANDATORY_CHANGE;eventTranslations[fieldStateEvent.Type.IS_HIDDEN_CHANGE]=EVENT_TYPE.FIELD_IS_HIDDEN_CHANGE;eventTranslations[fieldStateEvent.Type.IS_DISABLED_CHANGE]=EVENT_TYPE.FIELD_IS_DISABLED_CHANGE;eventTranslations[fieldStateEvent.Type.IS_VISIBLE_CHANGE]=EVENT_TYPE.FIELD_IS_VISIBLE_CHANGE;eventTranslations[fieldStateEvent.Type.IS_DISPLAY_CHANGE]=EVENT_TYPE.FIELD_IS_DISPLAY_CHANGE;eventTranslations[fieldStateEvent.Type.IS_READ_ONLY_CHANGE]=EVENT_TYPE.FIELD_IS_READ_ONLY_CHANGE;eventTranslations[fieldStateEvent.Type.LABEL_CHANGE]=EVENT_TYPE.FIELD_LABEL_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function addFieldStateEventDetails(event,fieldStateEvent)
{event.fieldId=fieldStateEvent.fieldState.id;if(fieldStateEvent.oldValue!==undefined){event.oldValue=fieldStateEvent.oldValue;}
if(fieldStateEvent.newValue!==undefined){event.newValue=fieldStateEvent.newValue;}
return event;}
function translateFieldStateEventToRecordControllerStateEvent(fieldStateEvent)
{return addFieldStateEventDetails(getEvent(translateFieldStateEventTypeToRecordControllerEventType(fieldStateEvent.type)),fieldStateEvent);}
function forwardFieldStateEvent(emitter,fieldStateEvent)
{emitter.emit(translateFieldStateEventToRecordControllerStateEvent(fieldStateEvent));}
function forwardFieldStateEvents(emitter,fieldState)
{var forward=forwardFieldStateEvent.bind(null,emitter);fieldState.on({types:[fieldStateEvent.Type.IS_MANDATORY_CHANGE,fieldStateEvent.Type.IS_HIDDEN_CHANGE,fieldStateEvent.Type.IS_DISABLED_CHANGE,fieldStateEvent.Type.IS_VISIBLE_CHANGE,fieldStateEvent.Type.IS_DISPLAY_CHANGE,fieldStateEvent.Type.IS_READ_ONLY_CHANGE,fieldStateEvent.Type.LABEL_CHANGE],listener:forward});}
var translateSublistStateEventTypeToRecordControllerEventType=(function(){var eventTranslations={};eventTranslations[sublistStateEvent.Type.IS_DISPLAY_CHANGE]=EVENT_TYPE.SUBLIST_IS_DISPLAY_CHANGE;eventTranslations[sublistStateEvent.Type.IS_HIDDEN_CHANGE]=EVENT_TYPE.SUBLIST_IS_HIDDEN_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_MANDATORY_CHANGE]=EVENT_TYPE.FIELD_IS_MANDATORY_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_HIDDEN_CHANGE]=EVENT_TYPE.FIELD_IS_HIDDEN_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_DISABLED_CHANGE]=EVENT_TYPE.FIELD_IS_DISABLED_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_VISIBLE_CHANGE]=EVENT_TYPE.FIELD_IS_VISIBLE_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_DISPLAY_CHANGE]=EVENT_TYPE.FIELD_IS_DISPLAY_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_IS_READ_ONLY_CHANGE]=EVENT_TYPE.FIELD_IS_READ_ONLY_CHANGE;eventTranslations[sublistStateEvent.Type.FIELD_LABEL_CHANGE]=EVENT_TYPE.FIELD_LABEL_CHANGE;return function(sublistStateEventType){return eventTranslations[sublistStateEventType];}}());function addSublistStateEventDetails(event,sublistStateEvent)
{event.sublistId=sublistStateEvent.sublistState.id;if(sublistStateEvent.hasOwnProperty('fieldId'))
{event.line=sublistStateEvent.line;event.currentLine=sublistStateEvent.currentLine;event.fieldId=sublistStateEvent.fieldId;}
if(sublistStateEvent.oldValue!==undefined){event.oldValue=sublistStateEvent.oldValue;}
if(sublistStateEvent.newValue!==undefined){event.newValue=sublistStateEvent.newValue;}
return event;}
function translateSublistStateEventToRecordControllerStateEvent(sublistStateEvent)
{return addSublistStateEventDetails(getEvent(translateSublistStateEventTypeToRecordControllerEventType(sublistStateEvent.type)),sublistStateEvent);}
function forwardSublistStateEvent(emitter,sublistStateEvent)
{emitter.emit(translateSublistStateEventToRecordControllerStateEvent(sublistStateEvent));}
function forwardSublistStateEvents(emitter,sublistState)
{var forward=forwardSublistStateEvent.bind(null,emitter);sublistState.on({types:[sublistStateEvent.Type.IS_DISPLAY_CHANGE,sublistStateEvent.Type.IS_HIDDEN_CHANGE,sublistStateEvent.Type.FIELD_IS_MANDATORY_CHANGE,sublistStateEvent.Type.FIELD_IS_HIDDEN_CHANGE,sublistStateEvent.Type.FIELD_IS_DISABLED_CHANGE,sublistStateEvent.Type.FIELD_IS_VISIBLE_CHANGE,sublistStateEvent.Type.FIELD_IS_DISPLAY_CHANGE,sublistStateEvent.Type.FIELD_IS_READ_ONLY_CHANGE,sublistStateEvent.Type.FIELD_LABEL_CHANGE],listener:forward});}
function unforwardSublistStateEvents(sublistState)
{sublistState.off({types:[sublistStateEvent.Type.IS_DISPLAY_CHANGE,sublistStateEvent.Type.IS_HIDDEN_CHANGE,sublistStateEvent.Type.FIELD_IS_MANDATORY_CHANGE,sublistStateEvent.Type.FIELD_IS_HIDDEN_CHANGE,sublistStateEvent.Type.FIELD_IS_DISABLED_CHANGE,sublistStateEvent.Type.FIELD_IS_VISIBLE_CHANGE,sublistStateEvent.Type.FIELD_IS_DISPLAY_CHANGE,sublistStateEvent.Type.FIELD_IS_READ_ONLY_CHANGE,sublistStateEvent.Type.FIELD_LABEL_CHANGE]})}
return Object.freeze({Type:EVENT_TYPE,forwardFieldStateEvents:forwardFieldStateEvents,forwardSublistStateEvents:forwardSublistStateEvents,unforwardSublistStateEvents:unforwardSublistStateEvents});});define('N/record/recordStateController',['N/record/fieldState','N/record/sublistState','N/record/recordStateControllerEvent','N/eventEmitter'],function(fieldState,sublistState,recordStateControllerEvent,eventEmitter){function createSublistState(sublistId,parentState,sublistMetadata,getModelController)
{var state=sublistState.create({id:sublistId,parentState:parentState,sublistStateObj:sublistMetadata.defaultState,fieldMetadata:sublistMetadata.fieldMetadata,getModelController:getModelController,isMultilineEditable:sublistMetadata.isMultilineEditable});state.init();return state;}
function RecordStateController(options)
{var that=this;var metadata=options.metadata;var modelController=options.data;var getModelController=options.getModelController;var isChanged=false;var emitter=eventEmitter.create();var fieldStates={};var sublistStates={};(function constructor(metadata,getModelController){var sublists=metadata.sublistIds;sublists.forEach(function(sublistId){var sublistMetadata=metadata.getSublistMetadata(sublistId);if(sublistMetadata)
{var sublist=createSublistState(sublistId,that,sublistMetadata,getModelController);recordStateControllerEvent.forwardSublistStateEvents(emitter,sublist);sublistStates[sublistId]=sublist;}});})(metadata,getModelController);Object.defineProperty(this,'isChanged',{get:function()
{return isChanged;},set:function(val)
{if(util.isBoolean(val))
isChanged=val;},enumerable:true,configurable:false});function createNewFieldState(fieldId)
{var state;var fieldLevelMetadata=metadata.getFieldMetadata(undefined,fieldId);if(fieldLevelMetadata)
{state=fieldState.createBasedOnFieldLevelMetadata({metadata:fieldLevelMetadata,parentState:that});}
else
{state=fieldState.create({parentState:that,fieldState:{name:fieldId,label:fieldId}});}
recordStateControllerEvent.forwardFieldStateEvents(emitter,state);return state;}
function removeFieldState(fieldId)
{if(fieldStates.hasOwnProperty(fieldId))
delete fieldStates[fieldId];}
this.removeFieldState=removeFieldState;function getFieldState(fieldId)
{var state;if(fieldStates.hasOwnProperty(fieldId))
state=fieldStates[fieldId];else
{state=createNewFieldState(fieldId);fieldStates[fieldId]=state;}
return state;}
this.getFieldState=getFieldState;function getSublistState(sublistId)
{var state=null;if(sublistStates.hasOwnProperty(sublistId))
state=sublistStates[sublistId];return state;}
this.getSublistState=getSublistState;function addSublist(sublistId,getModelController)
{removeSublist(sublistId);var sublistMetadata=metadata.getSublistMetadata(sublistId);var sublist=createSublistState(sublistId,that,sublistMetadata,getModelController);recordStateControllerEvent.forwardSublistStateEvents(emitter,sublist);sublistStates[sublistId]=sublist;}
this.addSublist=addSublist;function removeSublist(sublistId)
{var sublist=sublistStates[sublistId];if(!!sublist)
{delete sublistStates[sublistId];recordStateControllerEvent.unforwardSublistStateEvents(emitter,sublist);}}
function removeSublistFieldState(sublistId,fieldId,line)
{getSublistState(sublistId).removeFieldState(fieldId,line);getSublistState(sublistId).isChanged=true;}
this.removeSublistFieldState=removeSublistFieldState;function getAllFields()
{var arr=[];for(var f in fieldStates)
if(fieldStates.hasOwnProperty(f))
arr.push(f);return arr;}
this.getAllFields=getAllFields;function getAllSublists()
{var arr=[];for(var sublistId in sublistStates)
if(sublistStates.hasOwnProperty(sublistId))
arr.push(sublistId);return arr;}
this.getAllSublists=getAllSublists;this.on=emitter.on;this.off=emitter.off;}
return{create:function(options){return new RecordStateController(options);},isInstance:function(obj){return obj instanceof RecordStateController;}};});define('N/restricted/fieldClientScriptHandler',['N/restricted/reflet'],function(reflet){return reflet;});define('N/util/validator',['N/util/date','N/error','N/format','N/fieldTypeConstants','N/utilityFunctions'],function(DateUtil,error,format,fieldTypeConstants,utilityFunctions){var TLD_PATTERN="zw|zuerich|zone|zm|zippo|zip|zero|zara|zappos|za|yun|yt|youtube|you|yokohama|yoga|yodobashi|ye|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xn--zfr164b|xn--ygbi2ammx|xn--yfro4i67o|xn--y9a3aq|xn--xkc2dl3a5ee0h|xn--xkc2al3hye2a|xn--xhq521b|xn--wgbl6a|xn--wgbh1c|xn--w4rs40l|xn--w4r85el8fhu5dnra|xn--vuq861b|xn--vhquv|xn--vermgensberatung-pwb|xn--vermgensberater-ctb|xn--unup4y|xn--tiq49xqyj|xn--tckwe|xn--t60b56a|xn--ses554g|xn--s9brj9c|xn--rovu88b|xn--rhqv96g|xn--qxam|xn--qcka1pmc|xn--q9jyb4c|xn--pssy2u|xn--pgbs0dh|xn--pbt977c|xn--p1ai|xn--p1acf|xn--ogbpf8fl|xn--o3cw4h|xn--nyqy26a|xn--nqv7fs00ema|xn--nqv7f|xn--node|xn--ngbe9e0a|xn--ngbc5azd|xn--mxtq1m|xn--mk1bu44c|xn--mix891f|xn--mgbx4cd0ab|xn--mgbtx2b|xn--mgbt3dhd|xn--mgbpl2fh|xn--mgbi4ecexp|xn--mgberp4a5d4ar|xn--mgbca7dzdo|xn--mgbc0a9azcg|xn--mgbbh1a71e|xn--mgbb9fbpob|xn--mgbayh7gpa|xn--mgbab2bd|xn--mgbaam7a8h|xn--mgba7c0bbn0a|xn--mgba3a4f16a|xn--mgba3a3ejt|xn--mgb9awbf|xn--lgbbat1ad8j|xn--l1acc|xn--kput3i|xn--kpu716f|xn--kpry57d|xn--kprw13d|xn--kcrx77d1x4a|xn--jvr189m|xn--jlq61u9w7b|xn--j6w193g|xn--j1amh|xn--j1aef|xn--io0a7i|xn--imr513n|xn--i1b6b1a6a2e|xn--hxt814e|xn--h2brj9c|xn--gk3at1e|xn--gecrj9c|xn--gckr3f0f|xn--g2xx48c|xn--fzys8d69uvgm|xn--fzc2c9e2c|xn--fpcrj9c3d|xn--flw351e|xn--fjq720a|xn--fiqz9s|xn--fiqs8s|xn--fiq64b|xn--fiq228c5hs|xn--fhbei|xn--fct429k|xn--estv75g|xn--efvy88h|xn--eckvdtc9d|xn--e1a4c|xn--d1alf|xn--d1acj3b|xn--czru2d|xn--czrs0t|xn--czr694b|xn--co-pka|xn--clchc0ea0b2g2a9gcd|xn--cg4bki|xn--cck2b3b|xn--c2br7g|xn--c1avg|xn--bck1b9a5dre4c|xn--b4w605ferd|xn--9krt00a|xn--9et52u|xn--9dbq2a|xn--90ais|xn--90ae|xn--90a3ac|xn--8y0a063a|xn--80aswg|xn--80asehdb|xn--80aqecdr1a|xn--80ao21a|xn--80adxhks|xn--6qq986b3xl|xn--6frz82g|xn--5tzm5g|xn--5su34j936bgsg|xn--55qx5d|xn--55qw42g|xn--54b7fta0cc|xn--4gbrim|xn--45q11c|xn--45brj9c|xn--42c2d9a|xn--3pxu8k|xn--3oq18vl8pn36a|xn--3e0b707e|xn--3ds443g|xn--3bst00m|xn--30rr7y|xn--1qqw23a|xn--1ck2e1b|xn--11b4c3d|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|ws|wow|world|works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|wf|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|vu|voyage|voto|voting|vote|volvo|volkswagen|vodka|vn|vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|viajes|vi|vg|vet|versicherung|verisign|ventures|vegas|ve|vc|vanguard|vana|vacations|va|uz|uy|us|ups|uol|uno|university|unicom|uk|ug|uconnect|ubs|ubank|ua|tz|tw|tvs|tv|tushu|tunes|tui|tube|tt|trv|trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|tr|toys|toyota|town|tours|total|toshiba|toray|top|tools|tokyo|today|to|tn|tmall|tm|tl|tkmaxx|tk|tjx|tjmaxx|tj|tirol|tires|tips|tiffany|tienda|tickets|tiaa|theatre|theater|thd|th|tg|tf|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|td|tci|tc|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|sz|systems|symantec|sydney|sy|sx|swiss|swiftcover|swatch|sv|suzuki|surgery|surf|support|supply|supplies|sucks|su|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|st|srt|srl|sr|spreadbetting|spot|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|soccer|so|sncf|sn|smile|smart|sm|sling|sl|skype|sky|skin|ski|sk|sj|site|singles|sina|silk|si|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sh|sg|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|secure|seat|se|sd|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sc|sbs|sbi|sb|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|sa|ryukyu|rwe|rw|run|ruhr|ru|rsvp|rs|room|rogers|rodeo|rocks|rocher|ro|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|redumbrella|redstone|red|recipes|realty|realtor|realestate|read|re|raid|radio|racing|qvc|quest|quebec|qpon|qa|py|pwc|pw|pub|pt|ps|prudential|pru|protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|praxi|pramerica|pr|post|porn|politie|poker|pohl|pnc|pn|pm|plus|plumbing|playstation|play|place|pl|pk|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|philips|pharmacy|ph|pg|pfizer|pf|pet|pe|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|pa|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|om|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nz|nyc|nu|ntt|nrw|nra|nr|np|nowtv|nowruz|now|norton|northwesternmutual|nokia|no|nl|nissay|nissan|ninja|nikon|nike|nico|ni|nhk|ngo|ng|nfl|nf|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|ne|nc|nba|navy|natura|nationwide|name|nagoya|nadex|nab|na|mz|my|mx|mw|mv|mutuelle|mutual|museum|mu|mtr|mtpc|mtn|mt|msd|ms|mr|mq|mp|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|mobily|mobi|mo|mn|mma|mm|mls|mlb|ml|mk|mitsubishi|mit|mint|mini|mil|microsoft|miami|mh|mg|metlife|meo|menu|men|memorial|meme|melbourne|meet|media|med|me|md|mckinsey|mcdonalds|mcd|mc|mba|mattel|maserati|marshalls|marriott|markets|marketing|market|mango|management|man|makeup|maison|maif|madrid|macys|ma|ly|lv|luxury|luxe|lupin|lundbeck|lu|ltda|ltd|lt|ls|lr|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|locus|locker|loans|loan|lk|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|li|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|lc|lb|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|la|kz|kyoto|ky|kw|kuokgroup|kred|krd|kr|kpn|kpmg|kp|kosher|komatsu|koeln|kn|km|kiwi|kitchen|kindle|kinder|kim|kia|ki|kh|kg|kfh|kerryproperties|kerrylogistics|kerryhotels|ke|kddi|kaufen|juniper|juegos|jprs|jpmorgan|jp|joy|jot|joburg|jobs|jo|jnj|jmp|jm|jll|jlc|jio|jewelry|jetzt|jeep|je|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|it|istanbul|ist|ismaili|iselect|is|irish|ir|iq|ipiranga|io|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|industries|in|immobilien|immo|imdb|imamat|im|il|ikano|iinet|ifm|ieee|ie|id|icu|ice|icbc|ibm|hyundai|hyatt|hughes|hu|htc|ht|hsbc|hr|how|house|hotmail|hoteles|hot|hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hn|hm|hkt|hk|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|hair|gy|gw|guru|guitars|guide|guge|gucci|guardian|gu|gt|gs|group|gripe|green|gratis|graphics|grainger|gr|gq|gp|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|gn|gmx|gmo|gmbh|gmail|gm|globo|global|gle|glass|glade|gl|giving|gives|gifts|gift|gi|gh|ggee|gg|gf|george|genting|gent|gea|ge|gdn|gd|gbiz|gb|garden|gap|games|game|gallup|gallo|gallery|gal|ga|fyi|futbol|furniture|fund|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fr|fox|foundation|forum|forsale|forex|ford|football|foodnetwork|food|foo|fo|fm|fly|flowers|florist|flir|flights|flickr|fk|fj|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|fi|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|eurovision|eu|et|esurance|estate|esq|es|erni|ericsson|er|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|email|eg|ee|education|edu|edeka|eco|ec|eat|earth|dz|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|domains|doha|dog|dodge|doctor|docs|do|dnp|dm|dk|dj|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|de|dds|dclk|day|datsun|dating|date|dance|dad|dabur|cz|cyou|cymru|cy|cx|cw|cv|cuisinella|cu|csc|cruises|cruise|crs|crown|cricket|creditunion|creditcard|credit|cr|courses|coupons|coupon|country|corsica|corp|coop|cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|co|cn|cm|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|cl|ck|cityeats|city|citic|citi|citadel|cisco|circle|cipriani|ci|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|channel|chanel|ch|cg|cfd|cfa|cf|cern|ceo|center|ceb|cd|cc|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|ca|bzh|bz|by|bw|bv|buzz|buy|business|builders|build|bugatti|budapest|bt|bs|brussels|brother|broker|broadway|bridgestone|bradesco|br|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|boats|bo|bnpparibas|bnl|bn|bmw|bms|bm|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|bj|biz|bio|bingo|bing|bike|bid|bible|bi|bharti|bh|bg|bf|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|be|bd|bcn|bcg|bbva|bbt|bbc|bb|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|ba|azure|az|axa|ax|aws|aw|avianca|autos|auto|author|auspost|audio|audible|audi|au|attorney|athleta|at|associates|asia|asda|as|arte|art|arpa|army|archi|aramco|ar|aquarelle|aq|apple|app|apartments|aol|ao|anz|anquan|android|analytics|amsterdam|amica|amfam|amex|americanfamily|americanexpress|am|alstom|alsace|ally|allstate|allfinanz|alipay|alibaba|alfaromeo|al|akdn|airtel|airforce|airbus|aigo|aig|ai|agency|agakhan|ag|afl|afamilycompany|af|aetna|aero|aeg|ae|adult|ads|adac|ad|actor|active|aco|accountants|accountant|accenture|academy|ac|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa";var DOMAIN_PART_PATTERN="(?:[a-z0-9]+(?:-+[a-z0-9]+)*\\.)+(?:"+TLD_PATTERN+")";var SIMPLE_EMAIL_PATTERN_LOCAL_PART="[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*";var SIMPLE_EMAIL_PATTERN="^"+SIMPLE_EMAIL_PATTERN_LOCAL_PART+'@'+DOMAIN_PART_PATTERN+"$";var DISPLAY_NAME_PATTERN="(?:\\\\[^\\x00-\\x1f]|[^\"\\x00-\\x1f])*";var COMPOUND_EMAIL_PATTERN="\""+DISPLAY_NAME_PATTERN+"\"[ \\t]*<"+SIMPLE_EMAIL_PATTERN+">";var DIGIT_ONLY_REGEX=/^[0-9]+$/;var LOWERALPHANUMERIC_UNDERSCORE_REGEX=/^[0-9a-z_]+$/;var ALPHANUMERIC_UNDERSCORE_REGEX=/^[0-9A-Za-z_]+$/;var T_OR_F_REGEX=/(T|F)/;var COLOR_HEX_REGEX=/^#[0-9a-fA-F]{6}$/;var ASCII_CHARS_REGEX=/^[\x20-\x7E]+$/;var PACKAGE_REGEX=/^[a-z0-9]+(\.[a-z0-9]+){2}$/;var FURIGANA_REGEX=/^[\u0020\u3000\u30A0-\u30FF\uFF61-\uFF9F]+$/;var FUNCTION_REGEX=/^[0-9A-Za-z_$]+(\.[0-9A-Za-z_$]+)*$/;var NON_EMAIL_DELIMITER_REGEX_G=/("[^"\u0000-\u001f]*"|[^,;\n\r])+/g;var NON_ALPHANUMERIC_REGEX_G=/[^a-zA-Z0-9]/g;function validateByRegexTest(toValidate,regexPattern,msgKeyOnFail)
{if(!regexPattern.test(toValidate))
{if(!!msgKeyOnFail)
return{isValid:false,formattedValue:toValidate,errorMsgKey:msgKeyOnFail};else
return{isValid:false,formattedValue:""};}
else
{return{isValid:true,formattedValue:toValidate};}}
function validateDateObject(toValidate,fieldType)
{var isDate=Object.prototype.toString.call(toValidate)==='[object Date]';if(!(toValidate instanceof Date||isDate)||(isDate&&isNaN(toValidate.getDay())))
{var errorMsg="";if(fieldType===fieldTypeConstants.Type.DATE)
errorMsg=utilityFunctions.getErrorMessage(error.Type.INVALID_DATE_VALUE_MUST_BE_1,window.userfacing_dateformat);return{isValid:false,formattedValue:"",errorFullMsg:errorMsg};}
else if(DateUtil.isDateTooOld(toValidate))
{var errorMsg=utilityFunctions.getErrorMessage(error.Type.INVALID_DATE_VALUE_MUST_BE_ON_OR_AFTER_1CUTOFF_DATE,DateUtil.getOldestDateString());return{isValid:false,formattedValue:toValidate,errorFullMsg:errorMsg}}
else
{return{isValid:true,formattedValue:toValidate};}}
function validateMMYYDateObject(toValidate)
{if(!(toValidate instanceof Date||Object.prototype.toString.call(toValidate)==='[object Date]')||toValidate.getFullYear()<1900||toValidate.getFullYear()>2100)
{return{isValid:false,formattedValue:""};}
else
{return{isValid:true,formattedValue:toValidate};}}
function isWithinMinMax(toValidate,minVal,maxVal)
{var numVal=parseFloat(toValidate);var minimum=isNaN(parseFloat(minVal))?-Number.MAX_VALUE:minVal;var maximum=isNaN(parseFloat(maxVal))?Number.MAX_VALUE:maxVal;if(numVal<minimum||numVal>maximum)
{var fullErrorMsg=utilityFunctions.getErrorMessage(error.Type.INVALID_NUMBER_MUST_BE_BETWEEN_1_AND_2,String(minVal),String(maxVal));return{isValid:false,formattedValue:"",errorFullMsg:fullErrorMsg};}
else
{return{isValid:true,formattedValue:toValidate};}}
function validateBoolean(toValidate)
{if(toValidate===true||toValidate===false||toString.call(toValidate)==='[object Boolean]')
return{isValid:true,formattedValue:toValidate};else
return{isValid:false,formattedValue:""};}
function validateInteger(toValidate,posOnly,minVal,maxVal)
{var numVal=parseInt(toValidate,10);if(isNaN(toValidate)||(parseFloat(toValidate)!==numVal)||(posOnly&&(numVal<=0)))
{return{isValid:false,formattedValue:""};}
else
{return isWithinMinMax(toValidate,minVal,maxVal);}}
function validateNumericValue(toValidate,minVal,maxVal,fieldType)
{if(isNaN(toValidate)||isNaN(parseFloat(toValidate)))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.INVALID_NUMBER_OR_PERCENTAGE};}
var numVal=parseFloat(toValidate);var minimum=isNaN(parseFloat(minVal))?-Number.MAX_VALUE:minVal;var maximum=isNaN(parseFloat(maxVal))?Number.MAX_VALUE:maxVal;if(fieldType!==null&&fieldType!==undefined)
{if((fieldType===fieldTypeConstants.Type.POSFLOAT)||(fieldType===fieldTypeConstants.Type.POSCURRENCY))
{minimum=Number.MIN_VALUE;}
else if((fieldType===fieldTypeConstants.Type.NONNEGFLOAT)||(fieldType===fieldTypeConstants.Type.NONNEGCURRENCY))
{minimum=0;}}
return isWithinMinMax(numVal,minimum,maximum);}
function validateEmail(toValidate)
{var simpleEmailRegex=new RegExp(SIMPLE_EMAIL_PATTERN,"i");var compoundEmailRegex=new RegExp(COMPOUND_EMAIL_PATTERN,"i");var testResult=simpleEmailRegex.test(toValidate)||compoundEmailRegex.test(toValidate);return{isValid:testResult,formattedValue:toValidate};}
function validateEmails(toValidate)
{var emailList=toValidate.split(/[,;\n\r]/);var bademails=[];for(var i=0;i<emailList.length;i++)
{var anEmail=util.trim(emailList[i]);if(anEmail==="")
continue;if(!validateEmail(anEmail).isValid)
bademails.push(anEmail);}
if(bademails.length>0)
{var badEmailString=bademails.join(" ");var fullErrorMsg=utilityFunctions.getErrorMessage(error.Type.INVALID_EMAILS_FOUND)+badEmailString;return{isValid:false,formattedValue:"",errorFullMsg:fullErrorMsg};}
return{isValid:true,formattedValue:toValidate};}
function validateUrl(toValidate)
{var val=toValidate.toLowerCase();if(!(val.indexOf('/')===0||val.indexOf('http://')===0||val.indexOf('https://')===0||val.indexOf('ftp://')===0||val.indexOf('file://')===0))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.INVALID_URL_URL_MUST_START_WITH_HTTP_HTTPS_FTP_OR_FILE};}
if(val.indexOf(' ')>0||val.indexOf('\t')>0)
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.INVALID_URL_SPACES_ARE_NOT_ALLOWED_IN_THE_URL};}
return{isValid:true,formattedValue:toValidate};}
function validateCCNumber(toValidate)
{var cardnum=toValidate;if((cardnum.length>4)&&(cardnum.slice(0,-4).replace(new RegExp("\\*","g"),'').length===0)&&(cardnum.slice(-4).replace(new RegExp("\\*","g"),'').length===4))
{isValid=true;return cardnum;}
else
{if(cardnum.length<13||cardnum.length>20)
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.CREDIT_CARD_NUMBERS_MUST_CONTAIN_BETWEEN_13_AND_20_DIGITS};}
if(!DIGIT_ONLY_REGEX.test(cardnum))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.CREDIT_CARD_NUMBER_MUST_CONTAIN_ONLY_DIGITS};}
var no_digit=cardnum.length;var oddoeven=no_digit&1;var sum=0;for(var count=0;count<no_digit;count++)
{var digit=parseInt(cardnum.charAt(count),10);if(!((count&1)^oddoeven))
{digit*=2;if(digit>9)
digit-=9;}
sum+=digit;}
if(sum%10!==0)
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.CREDIT_CARD_NUMBER_IS_NOT_VALID__PLEASE_CHECK_THAT_ALL_DIGITS_WERE_ENTERED_CORRECTLY};}
return{isValid:true,formattedValue:toValidate};}}
function validatePhoneNumber(toValidate,isFullPhoneType)
{if(!(ASCII_CHARS_REGEX.test(toValidate)))
{return{isValid:false,formattedValue:""};}
var validPhoneDigits=toValidate.replace(NON_ALPHANUMERIC_REGEX_G,'');if(validPhoneDigits.length<7)
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.PHONE_NUMBER_SHOULD_HAVE_SEVEN_DIGITS_OR_MORE};}
if(isFullPhoneType&&(validPhoneDigits.length<10))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.PLEASE_INCLUDE_THE_AREA_CODE_FOR_PHONE_NUMBER};}
return{isValid:true,formattedValue:toValidate}}
function validateIdentifier(toValidate,lowercaseOnly)
{var re=lowercaseOnly?LOWERALPHANUMERIC_UNDERSCORE_REGEX:ALPHANUMERIC_UNDERSCORE_REGEX;if(!re.test(toValidate))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.IDENTIFIERS_CAN_CONTAIN_ONLY_DIGITS_ALPHABETIC_CHARACTERS_OR__WITH_NO_SPACES};}
else
return{isValid:true,formattedValue:toValidate};}
function validateCCDate(toValidate,checkNotBeforeToday)
{var toValidateDate=toValidate.split("/");if(toValidate.length!==7||toValidateDate.length!==2||toValidateDate[0].length!==2||toValidateDate[1].length!==4)
{errorKey=checkNotBeforeToday?error.Type.PLEASE_ENTER_AN_EXPIRATION_DATE_IN_MMYYYY_FORMAT:error.Type.PLEASE_ENTER_A_VALID_FROM_START_DATE_IN_MMYYYY_FORMAT;return{isValid:false,formattedValue:"",errorMsgKey:errorKey};}
else
{var toValidateMonth=DIGIT_ONLY_REGEX.test(toValidateDate[0])?parseInt(toValidateDate[0],10):NaN;var toValidateYear=DIGIT_ONLY_REGEX.test(toValidateDate[1])?parseInt(toValidateDate[1],10):NaN;if(isNaN(toValidateMonth)||toValidateMonth<1||toValidateMonth>12||isNaN(toValidateYear)||toValidateYear<1000)
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT};}
else
{var today=new Date();if(checkNotBeforeToday&&(toValidateYear<today.getFullYear()||((toValidateYear===today.getFullYear())&&toValidateMonth<(today.getMonth()+1)))||!checkNotBeforeToday&&(toValidateYear>today.getFullYear()||((toValidateYear===today.getFullYear())&&toValidateMonth>(today.getMonth()+1))))
{return{isValid:false,formattedValue:"",errorMsgKey:error.Type.NOTICE_THE_CREDIT_CARD_APPEARS_TO_BE_INCORRECT};}
else
{return{isValid:true,formattedValue:toValidate};}}}}
function validateValueLength(fieldName,fieldValue,maxLen,useStrict)
{var validateMe=(useStrict&&!isNaN(parseFloat(fieldValue))&&isFinite(fieldValue))?(""+fieldValue):fieldValue;if(!isNaN(maxLen)&&(maxLen>0)&&(validateMe.length>maxLen))
{throwError({name:error.Type.INVALID_FLD_VALUE,message:utilityFunctions.getErrorMessage(error.Type.THE_FIELD_1_CONTAINED_MORE_THAN_THE_MAXIMUM_NUMBER__2__OF_CHARACTERS_ALLOWED,fieldName,maxLen)});}}
function validateField(fieldName,fieldType,fieldValue,isNum,isCurr,validationType,minVal,maxVal,maxLength,mandatory,useStrict)
{if((fieldValue===undefined)||(fieldValue===null)||(fieldValue.length===0))
{if(mandatory)
{throwError({name:error.Type.INVALID_FLD_VALUE,message:utilityFunctions.getErrorMessage(error.Type.FIELD_MUST_CONTAIN_A_VALUE)});}
else if(fieldType!==fieldTypeConstants.Type.CHECKBOX)
{return fieldValue;}}
var isNumeric=isNum||fieldTypeConstants.isNumeric(fieldType);var isCurrency=isCurr||fieldTypeConstants.isCurrency(fieldType);useStrict=useStrict&&(fieldType!==fieldTypeConstants.Type.TIME);validateValueLength(fieldName,fieldValue,maxLength,useStrict);switch(true)
{case(fieldType===fieldTypeConstants.Type.DATE)||(fieldType===fieldTypeConstants.Type.TIMEOFDAY)||(fieldType===fieldTypeConstants.Type.DATETIME)||(fieldType===fieldTypeConstants.Type.DATETIMETZ):validationPackage=validateDateObject(fieldValue,fieldType);break;case(fieldType===fieldTypeConstants.Type.MMYYDATE):validationPackage=validateMMYYDateObject(fieldValue);break;case(fieldType===fieldTypeConstants.Type.INTEGER):validationPackage=validateInteger(fieldValue,false,minVal,maxVal);break;case(fieldType===fieldTypeConstants.Type.POSINTEGER):validationPackage=validateInteger(fieldValue,true,minVal,maxVal);break;case(fieldType===fieldTypeConstants.Type.TIMETRACK)||(fieldType===fieldTypeConstants.Type.RATE)||(fieldType===fieldTypeConstants.Type.RATEHIGHPRECISION):validationPackage=validateNumericValue(fieldValue,minVal,maxVal);break;case(fieldType===fieldTypeConstants.Type.TIME):minVal=(!minVal||(minVal<0))?0:minVal;validationPackage=validateNumericValue(fieldValue,minVal,maxVal);break;case(fieldType===fieldTypeConstants.Type.PERCENT):validationPackage=validateNumericValue(fieldValue,minVal,maxVal);break;case(!!isNumeric||!!isCurrency):validationPackage=validateNumericValue(fieldValue,minVal,maxVal,fieldType);break;case(fieldType===fieldTypeConstants.Type.EMAIL):validationPackage=validateEmail(fieldValue);break;case(fieldType===fieldTypeConstants.Type.EMAILS):validationPackage=validateEmails(fieldValue);break;case(fieldType===fieldTypeConstants.Type.URL):validationPackage=validateUrl(fieldValue);break;case(fieldType===fieldTypeConstants.Type.CHECKBOX):validationPackage=validateBoolean(fieldValue);break;case(fieldType===fieldTypeConstants.Type.CCNUMBER):validationPackage=validateCCNumber(fieldValue);break;case(fieldType===fieldTypeConstants.Type.PHONE):validationPackage=validatePhoneNumber(fieldValue,false);break;case(fieldType===fieldTypeConstants.Type.FULLPHONE):validationPackage=validatePhoneNumber(fieldValue,true);break;case(fieldType===fieldTypeConstants.Type.IDENTIFIER):validationPackage=validateIdentifier(fieldValue,true);break;case(fieldType===fieldTypeConstants.Type.IDENTIFIERANYCASE):validationPackage=validateIdentifier(fieldValue,false);break;case(fieldType===fieldTypeConstants.Type.CCEXPDATE):validationPackage=validateCCDate(fieldValue,true);break;case(fieldType===fieldTypeConstants.Type.CCVALIDFROM):validationPackage=validateCCDate(fieldValue,false);break;case(fieldType===fieldTypeConstants.Type.COLOR):validationPackage=validateByRegexTest(fieldValue,COLOR_HEX_REGEX,error.Type.COLOR_VALUE_MUST_BE_6_HEXADECIMAL_DIGITS_OF_THE_FORM_RRGGBB__EXAMPLE_FF0000_FOR_RED);break;case(fieldType===fieldTypeConstants.Type.PACKAGE):validationPackage=validateByRegexTest(fieldValue,PACKAGE_REGEX,error.Type.INVALID_SUITEAPP_APPLICATION_ID);break;case(fieldType===fieldTypeConstants.Type.FURIGANA):validationPackage=validateByRegexTest(fieldValue,FURIGANA_REGEX,error.Type.NON_KATAKANA_DATA_FOUND);break;case(fieldType===fieldTypeConstants.Type.FUNCTION):case(validationType!==null)&&(typeof validationType!=="undefined")&&(validationType.toLowerCase()===fieldTypeConstants.Type.QUOTEDFUNCTION):validationPackage=validateByRegexTest(fieldValue,FUNCTION_REGEX);break;default:return fieldValue;}
if(!validationPackage.isValid||validationPackage.formattedValue.length===0)
{var errorCode=validationPackage.errorCode?validationPackage.errorCode:error.Type.INVALID_FLD_VALUE;if(!!validationPackage.errorFullMsg)
{throwError({name:errorCode,message:validationPackage.errorFullMsg});}
else
{if(!!isNumeric||!!isCurrency)
{fieldName=fieldName.replace("_formattedValue","");}
var errorMsgKey=validationPackage.errorMsgKey?validationPackage.errorMsgKey:error.Type.INVALID_FIELD_VALUE;var errorMessage=utilityFunctions.getErrorMessage(errorMsgKey,String(fieldValue),fieldName);throwError({name:errorCode,message:errorMessage.replace(/\\\"/g,"\"")});}}
return validationPackage.formattedValue;}
function throwError(e)
{throw error.create(e);}
function validateRadioField(fieldName,fieldValue,radioSet)
{if((radioSet===null)||(typeof radioSet==="undefined")||!radioSet.hasOwnProperty(fieldValue))
{throw error.create({name:error.Type.INVALID_FLD_VALUE,message:utilityFunctions.getErrorMessage(error.Type.INVALID_FIELD_VALUE,String(fieldValue),fieldName)});}
return fieldValue;}
function validateRadioFieldByText(fieldId,text,radioSet)
{if(radioSet!==null&&radioSet!==undefined)
{for(var key in radioSet)
{if(radioSet.hasOwnProperty(key)&&radioSet[key]===text)
return key;}}
throw error.create({name:error.Type.INVALID_FLD_VALUE,message:utilityFunctions.getErrorMessage(error.Type.INVALID_FIELD_VALUE,String(text),fieldId)});}
function validateCheckBoxField(fieldId,text)
{if(utilityFunctions.isValEmpty(text))
{throw error.create({name:error.Type.INVALID_FLD_VALUE,message:utilityFunctions.getErrorMessage(error.Type.INVALID_FIELD_VALUE,String(text),fieldId)});}}
return Object.freeze({validateField:validateField,validateRadioField:validateRadioField,validateRadioFieldByText:validateRadioFieldByText,validateCheckBoxField:validateCheckBoxField});});define('N/record/recordFieldEvent',[],function()
{var EVENT_TYPE=Object.freeze({FIELD_VALUE_CHANGE:'FIELD_VALUE_CHANGE'});function getEvent(type,recordField)
{return{type:type,recordField:recordField};}
function addErrorDetails(event,error)
{event.error=error;return event;}
function wrapValueValidation(options)
{var func=options.func;var emitter=options.emitter;var recordField=options.recordField;return function(){var result=undefined;try
{result=func.apply(null,arguments);}
catch(error)
{emitter.emit(addErrorDetails(getEvent(EVENT_TYPE.FIELD_VALUE_CHANGE,recordField),error));throw error;}
return result;}}
return Object.freeze({Type:EVENT_TYPE,wrapValueValidation:wrapValueValidation});});define('N/record/recordField',['N/restricted/fieldClientScriptHandler','N/restricted/invoker','N/fieldUtil','N/utilityFunctions','N/error','N/nsobject','N/util/formatter','N/util/validator','N/record/recordFieldEvent','N/eventEmitter'],function(remoteApi,invoker,fieldUtil,utilityFunctions,error,nsobject,formatter,validator,recordFieldEvent,eventEmitter){var INVALID_KEY_OR_REF='INVALID_KEY_OR_REF';var UPDATE_FIELD_ATTRIBUTE="updateFieldAttribute",UPDATE_FIELD_ATTRIBUTE_EXCEPTION="updateFieldAttributeException",UPDATE_LINEITEM_FIELD_ATTRIBUTE="updateLineItemFieldAttribute",UPDATE_LINEITEM_FIELD_ATTRIBUTE_EXCEPTION="updateLineItemFieldAttributeException";function SelectOption(text,id)
{function getText(){return text;}
function getId(){return id;}
function toJSON(){return{id:id,text:text};}
function toString(){return "SelectOption";}
this.getText=getText;this.getId=getId;this.toJSON=toJSON;this.toString=toString()}
SelectOption.prototype=nsobject.getNewInstance();Object.freeze(SelectOption);function Field(params)
{var that=this;var field=params;var recordFunctions=params.recordFunctions;var metadata=params.metadata;var fieldState=params.fieldState;var label=fieldState.label;var emitter=eventEmitter.create();function getFieldInfo()
{return{sublistId:getSublistName(),fieldId:String(metadata.name),lineNum:parseInt(getLine(),10)};}
function isRecordDynamic()
{return field.isRecordDynamic;}
function isCurrentRecord()
{return field.isCurrentRecord;}
function getRecordForm(){return field.form;}
function getFieldOptions(){return recordFunctions.getFieldOptions();}
function setRecordInternalEventFlag(isInternal)
{recordFunctions.setInternalEvent(isInternal);}
function getRecordInternalEventFlag()
{return recordFunctions.isInternal();}
function constructSelectOptions(options)
{var selectOptions=[];for(var i=0;i<options.length;i++)
{if(options[i]instanceof SelectOption)
{selectOptions.push(options[i]);continue;}
if(!utilityFunctions.isValEmpty(options[i].id))
selectOptions.push(new SelectOption(options[i].text,options[i].id));}
return selectOptions;}
function getValidFilterOperation(op)
{if(typeof op==='undefined')
return 'contains';var validOperations=['contains','is','startswith'];if(validOperations.indexOf(op.toLowerCase())>-1)
return op.toLowerCase();else
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_GETSELECTOPTION_FILTER_OPERATOR,op,validOperations.join(','));}
function filterOptions(options,filter,filterOperation)
{var toRet=[];for(var i=0;i<options.length;i++)
{var isValid=isOptionValid(options[i],filter,filterOperation);if(isValid)
toRet.push(options[i]);}
return toRet;}
function isOptionValid(option,filter,filterOperation)
{var isValid=false;if((filterOperation==='contains')||(filterOperation==='startswith'))
{var pos=option.getText().toLowerCase().search(filter.toLowerCase());if(filterOperation==='startswith')
isValid=(pos===0);else
isValid=(pos>-1);}
else if(filterOperation==='is')
{isValid=option.getText().toLowerCase()===filter.toLowerCase();}
return isValid;}
function cacheFieldOption(options,action,data)
{if(getRecord().isDynamic)
{getFieldOptions().put(getSublistName(),getName(),getLine(),options,action,data);cacheSelectOptionTexts(getSublistName(),getName(),options);}}
function cacheFieldColumnOption(options,action,data)
{if(getRecord().isDynamic&&getSublistName())
{getFieldOptions().put(getSublistName(),getName(),-1,options,action,data);cacheSelectOptionTexts(getSublistName(),getName(),options);}}
function cacheSelectOptionTexts(sublistName,fieldName,options)
{var modelController=getRecord().getModelController();(options||[]).forEach(function(option){modelController.cacheSelectOptionText(sublistName,fieldName,option.getId(),option.getText());});}
function getOptionsFromRecordFieldCache()
{if(getRecord().isDynamic)
return getFieldOptions().get(getSublistName(),getName(),getLine());else
return null;}
function getOptionsFromRecordFieldColumnCache()
{if(getRecord().isDynamic&&getSublistName())
return getFieldOptions().get(getSublistName(),getName(),-1);else
return null;}
function getRecord(){return field.record;}
function getSubrecordType(){return metadata.subrecordType;}
function getSubrecordIdField(){return metadata.subrecordIdField;}
function isSublistField(){return(field.sublistId)?true:false;}
function isMachineHeaderField(){return metadata.isMachineHeaderField;}
function acceptEmptyValueForSelectField(){return metadata.acceptEmptyValueForSelectField;}
function isRadioField(){return getType()==='radio';}
function isPopup(){return metadata.isPopup;}
function getType(){return metadata.type;}
function getName(){return metadata.name;}
function getFieldState(){return fieldState;}
function getSublistName(){return field.sublistId?String(field.sublistId):null;}
function getLine(){return field.lineNum||field.lineNum===0?field.lineNum:-1;}
function setLine(ln)
{field.lineNum=ln;}
function getMaxLength(){return metadata.maxLength;}
function isNumeric(){return metadata.isNumeric;}
function isCurrency(){return metadata.isCurrency;}
function getMinValue(){return(metadata.hasMinValue)?metadata.minValue:undefined;}
function getMaxValue(){return(metadata.hasMaxValue)?metadata.maxValue:undefined;}
function getValidationFieldType(){return metadata.fieldTypeForValidation;}
function noSlaving(){return getFieldState().ignoreSlaving;}
function setNoSlaving(noSlaving){getFieldState().ignoreSlaving=noSlaving;return that;}
function isDisabled(){return getFieldState().isDisabled;}
function setDisabled(disable)
{disable=!!disable;var oldDisabled=getFieldState().isDisabled;if(disable!==oldDisabled){getFieldState().isDisabled=disable;}
return that;}
function isDefaultMandatory(){return getFieldState().isDefaultMandatory;}
function isMandatory(){return getFieldState().isMandatory;}
function setMandatory(mandatory)
{mandatory=!!mandatory;var oldMandatory=getFieldState().isMandatory;if(mandatory!==oldMandatory){getFieldState().isMandatory=mandatory;}
return that;}
function isDisplay(){return getFieldState().isDisplay;}
function setDisplay(display)
{display=!!display;var oldDisplay=getFieldState().isDisplay;if(display!==oldDisplay){getFieldState().isDisplay=display;}
return that;}
function isVisible(){return getFieldState().isVisible;}
function setVisible(visible)
{visible=!!visible;var oldVisible=getFieldState().isVisible;if(visible!==oldVisible){getFieldState().isVisible=visible;}
return that;}
function isReadOnly(){return getFieldState().isReadOnly;}
function setReadOnly(readonly)
{readonly=!!readonly;var oldReadonly=getFieldState().isReadOnly;if(readonly!==oldReadonly){getFieldState().isReadOnly=readonly;}
return that;}
function getLabel()
{if(getFieldState().label!==label)
label=getFieldState().label;return label;}
function setLabel(newLabel)
{newLabel=''+newLabel;var oldLabel=label;if(newLabel!==oldLabel){label=newLabel;getFieldState().label=newLabel;}
return that;}
function getRecordFieldValue(sublistId,fieldId,lineNum)
{try{var wasInternal=getRecordInternalEventFlag();setRecordInternalEventFlag(true);if(sublistId)
{if(isRecordDynamic()&&(lineNum===-1||lineNum===getRecord().doGetCurrentSublistIndex(sublistId)))
return getRecord().getCurrentSublistLineValueAsLegacyString(sublistId,fieldId);else
return getRecord().getSublistLineValueAsLegacyString(sublistId,fieldId,lineNum);}
else
return getRecord().getValueAsLegacyString(fieldId);}
finally
{setRecordInternalEventFlag(wasInternal);}}
function getRecordQueryRequest()
{return recordFunctions.getQueryRequest.call();}
function getRequestParam()
{var queryRequest=getRecordQueryRequest();markQueryRequest(queryRequest.payload,getName());return[getRecord().type,queryRequest.url,queryRequest.payload,getFieldInfo()];}
function getSelectOptionForPopup(idsOrTexts,byIds)
{idsOrTexts=utilityFunctions.normalizeArrayOrSingularObjectArg(idsOrTexts);var lookupBind=[];for(var i=0;i<idsOrTexts.length;i++)
lookupBind.push((util.isString(idsOrTexts[i])&&!metadata.hasStaticOptions)?"'"+idsOrTexts[i]+"'":idsOrTexts[i]);var requestParam=getRequestParam();requestParam.push(getOptionMastersAndAuxFieldsValue(),lookupBind,byIds);return invoker(remoteApi,'getSelectOptionForPopup',requestParam);}
function getSelectOptionsWithSupplementedOptions()
{var optionList=null;var cachedOptions=getOptionsFromRecordFieldCache();if(!Array.isArray(cachedOptions))
{var supplementalOptions=metadata.supplementedOptions;if(Array.isArray(supplementalOptions))
{optionList=supplementalOptions;}}
else
{optionList=cachedOptions;}
return optionList;}
function getSelectOptions(filter,filterOperator,lookupBind)
{var selectOptions=[];if(fieldUtil.isSelectType(getType()))
{var options=getOptionsFromRecordFieldCache();if(isPopup())
{options=(lookupBind)?getSelectOptionForPopup(lookupBind,true):getSelectOptionFromServer();}
else if(options===null||options===undefined)
{var supplementalOptions=getSelectOptionsWithSupplementedOptions();options=(Array.isArray(supplementalOptions))?supplementalOptions:getSelectOptionFromServer();options=constructSelectOptions(options);cacheFieldOption(options);}
selectOptions=extendWithColumnOptions(constructSelectOptions(options));}
else if(isRadioField())
{selectOptions=getRadioSelectOption();}
if(filter)
selectOptions=filterOptions(selectOptions,filter,getValidFilterOperation(filterOperator));return selectOptions;}
function getColumnSelectOptions(filter,filterOperator,lookupBind)
{var columnSelectOptions=[];if(getSublistName()&&fieldUtil.isSelectType(getType())&&!isPopup())
{var options=getOptionsFromRecordFieldColumnCache()||[];columnSelectOptions=constructSelectOptions(options);}
if(filter)
columnSelectOptions=filterOptions(columnSelectOptions,filter,getValidFilterOperation(filterOperator));return columnSelectOptions;}
function extendWithColumnOptions(lineOptions)
{lineOptions=lineOptions||[];var columnOptions=getColumnSelectOptions();columnOptions.forEach(function(columnOption){if(!lineOptions.some(function(lineOption){return lineOption.getId()===columnOption.getId();}))lineOptions.push(columnOption);});return lineOptions;}
function insertSelectOption(value,text,selected,isColumnOption)
{if(!isCurrentRecord())
fieldUtil.verifyPrefixedWithCustPage(getName());var addedOpt=new SelectOption(text,value);if(isColumnOption)
{var columnOptions=getColumnSelectOptions();if(columnOptions.some(function(v){return v.getId()===value;}))
utilityFunctions.throwSuiteScriptError(error.Type.SELECT_OPTION_ALREADY_PRESENT,value);columnOptions.push(addedOpt);cacheFieldColumnOption(columnOptions,'add',addedOpt);}
var myOptions=getSelectOptions();if(!isColumnOption)
{if(myOptions.some(function(v){return v.getId()===value;}))
utilityFunctions.throwSuiteScriptError(error.Type.SELECT_OPTION_ALREADY_PRESENT,value);myOptions.push(addedOpt);cacheFieldOption(myOptions,'add',addedOpt);}
recordFunctions.updateSelectOptions(getSublistName(),getName(),getLine(),myOptions,value,text,selected);}
function removeSelectOption(value,isColumnOption)
{fieldUtil.verifyPrefixedWithCustPage(getName());if(isColumnOption)
{var columnOptions=getColumnSelectOptions();var removedColumnOpt=null;var postRemovalColumnOptionList=columnOptions.filter(function(v){if(v.getId()===value){removedColumnOpt=v;return false;}
return true;});if(removedColumnOpt===null)
utilityFunctions.throwSuiteScriptError(error.Type.SELECT_OPTION_NOT_FOUND,value);cacheFieldColumnOption(postRemovalColumnOptionList,'remove',removedColumnOpt);}
var myOptions=getSelectOptions();if(!isColumnOption)
{var removedOpt=null;var postRemovalOptionList=myOptions.filter(function(v){if(v.getId()===value){removedOpt=v;return false;}
return true;});if(removedOpt===null)
utilityFunctions.throwSuiteScriptError(error.Type.SELECT_OPTION_NOT_FOUND,value);cacheFieldOption(postRemovalOptionList,'remove',removedOpt);}}
function getOptionMastersAndAuxFieldsValue()
{var fields=metadata.optionMastersAndAuxFields;var toRet=[];fields.forEach(function(field){toRet.push({fieldId:field.fieldName,sublistId:field.sublistName,value:getRecordFieldValue(field.sublistName,field.fieldName,getLine())});});return toRet;}
function getRadioSet(fieldId)
{return recordFunctions.getRadioSet.call(getRecord(),fieldId);}
function getRadioSelectOption()
{var selectOptions=[];if(isSublistField()&&!isMachineHeaderField())
{for(var i=1;i<=getRecord().getLineItemCount(getSublistName());i++)
selectOptions.push(new SelectOption(getLabel(),String(i)));}
else
{var radioValues=getRadioSet(getName());for(var radioValue in radioValues)
{selectOptions.push(new SelectOption(radioValues[radioValue],radioValue));}}
return selectOptions;}
function getSelectOptionFromServer()
{var queryRequest=getRecordQueryRequest();markQueryRequest(queryRequest.payload,getName());var requestParam=[getRecord().type,queryRequest.url,queryRequest.payload,getFieldInfo(),getOptionMastersAndAuxFieldsValue()];return invoker(remoteApi,'getFieldSelectOptions',requestParam);}
function removeEmptyValueForPopUpSelect(value)
{var newArray=[];for(var idx=0;idx<value.length;idx++)
{if(!utilityFunctions.isValEmpty(value[idx])&&!considerAsEmptyForPopup(value[idx]))
newArray.push(value[idx]);}
return newArray;}
function validateEmptyValue(value)
{var valArray=util.isArray(value)?value:[value];validateEmptyValueInArray(valArray);}
function validateSelectFieldByText(text)
{var result=text;validateEmptyValue(text);if(!utilityFunctions.isValEmpty(text)&&!considerAsEmptyForPopup(text))
{var options;if(isPopup())
{if(util.isArray(text))
text=removeEmptyValueForPopUpSelect(text);options=getSelectOptionForPopup(text,false);options=constructSelectOptions(options);result=findIdInFieldOptions(options,text);}
else if(isRadioField())
{var thisRadioSet=getRadioSet(getName());result=validator.validateRadioFieldByText(getName(),text,thisRadioSet);}
else
{options=getSelectOptions();result=findIdInFieldOptions(options,text);}}
return result;}
function considerAsEmptyForPopup(value)
{if(isPopup())
{return["<Type then tab>","<Type & tab for single value>"].indexOf(value)>-1;}
else
return false;}
function validateSelectField(value,option)
{validateEmptyValue(value);if(!utilityFunctions.isValEmpty(value)&&!considerAsEmptyForPopup(value))
{if(util.isArray(value)&&!areIdsInFieldOptions(option,value))
{throw error.create({name:INVALID_KEY_OR_REF,message:utilityFunctions.getErrorMessage(error.Type.INVALID_KEY_OR_REF,getName(),JSON.stringify(value))});}
else if(!util.isArray(value)&&!isIdInFieldOptions(option,value))
{throw error.create({name:INVALID_KEY_OR_REF,message:utilityFunctions.getErrorMessage(error.Type.INVALID_KEY_OR_REF,getName(),value)});}}}
function validateEmptyValueInArray(valueArray)
{if(!acceptEmptyValueForSelectField()&&(utilityFunctions.arrayContains(valueArray,'')||utilityFunctions.arrayContains(valueArray,null)||utilityFunctions.arrayContains(valueArray,undefined)))
{utilityFunctions.throwSuiteScriptError(error.Type.EMPTY_KEY_NOT_ALLOWED,getName());}}
function areIdsInFieldOptions(options,ids)
{var keyList=[];for(var i=0;i<options.length;i++)
keyList.push(options[i].getId());for(var j=0;i<ids.length;j++)
{if(keyList.indexOf(ids[j])===-1)
return false;}
return true;}
function isIdInFieldOptions(options,id)
{for(var i=0;i<options.length;i++)
{if(options[i].getId()==id)
return true;}
return false;}
function findIdInFieldOptions(options,text)
{if(util.isArray(text))
return findIdsInFieldOptions(options,text);for(var i=0;i<options.length;i++)
{if(options[i].getText()===text)
return options[i].getId();}
throw error.create({name:INVALID_KEY_OR_REF,message:utilityFunctions.getErrorMessage(error.Type.INVALID_KEY_OR_REF,getName(),String(text))});}
function findIdsInFieldOptions(options,texts)
{var internalIds=[];var validTexts=[];for(var i=0;i<options.length;i++)
{if(texts.indexOf(options[i].getText())>-1)
{internalIds.push(options[i].getId());validTexts.push(options[i].getText());}}
if(validTexts.length!==texts.length)
{var invalidTexts=[];for(var j=0;j<texts.length;j++)
if(validTexts.indexOf(texts[j])==-1)
invalidTexts.push(texts[j]);throw error.create({name:INVALID_KEY_OR_REF,message:utilityFunctions.getErrorMessage(error.Type.INVALID_KEY_OR_REF,getName(),JSON.stringify(invalidTexts))});}
return internalIds;}
function validateAndFormatFieldValue(value,useStrict)
{var returnedValue=value;if(fieldUtil.isSelectType(getType())&&isRecordDynamic())
{var options=getSelectOptions(null,null,value);if(options){validateSelectField(value,options);}
else{validateSelectFieldData(value);}
if(util.isArray(value))
returnedValue=value.map(function(val){return String(val);});else
returnedValue=String(value);}
else if(isRadioField())
{var thisRadioSet=getRadioSet(getName());returnedValue=validator.validateRadioField(getName(),value,thisRadioSet);}
else
{var validateMe=value;returnedValue=validator.validateField(getName(),getType(),validateMe,isNumeric(),isCurrency(),getValidationFieldType(),getMinValue(),getMaxValue(),getMaxLength(),isMandatory(),!!useStrict);}
return returnedValue;}
function validateSelectFieldData(idsOrTexts)
{var idsOrTexts=utilityFunctions.normalizeArrayOrSingularObjectArg(idsOrTexts);var fieldValue=String(idsOrTexts);if(fieldUtil.isMultiSelectType(getType())&&idsOrTexts.length>1)
{fieldValue=idsOrTexts.join(String.fromCharCode(5));}
var isValid=false;if(fieldUtil.isSelectType(getType())&&fieldUtil.isPrefixedWithCustPage(getName())&&(idsOrTexts!==null))
{var myOptions=getSelectOptions();cacheFieldOption(myOptions);var matchedOptions=myOptions.filter(function(v){return idsOrTexts.indexOf(v.getId())>-1;});isValid=matchedOptions.length>0;}
else
{var requestParam=getRequestParam();requestParam.push(getOptionMastersAndAuxFieldsValue(),fieldValue);isValid=invoker(remoteApi,'validateSelectField',requestParam);}
return isValid;}
function markQueryRequest(request,fieldId)
{request.q=String(fieldId);}
function toString(){return "Field"}
function toJSON()
{return{name:getName(),type:getType(),label:getLabel()};}
this.validateAndFormatFieldValue=recordFieldEvent.wrapValueValidation({emitter:emitter,recordField:that,func:validateAndFormatFieldValue});this.validateSelectFieldByText=recordFieldEvent.wrapValueValidation({emitter:emitter,recordField:that,func:validateSelectFieldByText});this.setLine=setLine;this.getLine=getLine;this.on=emitter.on;this.off=emitter.off;this.getType=getType;this.getSubrecordType=getSubrecordType;this.getSubrecordIdField=getSubrecordIdField;this.getName=getName;this.getSublistName=getSublistName;this.isPopup=isPopup;this.getMaxLength=getMaxLength;this.isNumeric=isNumeric;this.isCurrency=isCurrency;this.getMinValue=getMinValue;this.getMaxValue=getMaxValue;this.getValidationFieldType=getValidationFieldType;this.noSlaving=noSlaving;this.setNoSlaving=setNoSlaving;this.isDisabled=isDisabled;this.setDisabled=setDisabled;this.isDefaultMandatory=isDefaultMandatory;this.isMandatory=isMandatory;this.setMandatory=setMandatory;this.isDisplay=isDisplay;this.setDisplay=setDisplay;this.isVisible=isVisible;this.setVisible=setVisible;this.isReadOnly=isReadOnly;this.setReadOnly=setReadOnly;this.getLabel=getLabel;this.setLabel=setLabel;this.getSelectOptions=getSelectOptions;this.insertSelectOption=insertSelectOption;this.removeSelectOption=removeSelectOption;this.getRequestParam=getRequestParam;this.isCurrentRecord=isCurrentRecord;this.toJSON=toJSON;this.toString=toString;}
Field.prototype=nsobject.getNewInstance();Object.freeze(Field);return Object.freeze({create:function(params){return new Field(params);},isSelectType:fieldUtil.isSelectType,Type:fieldUtil.SELECT_FIELD_TYPES})});define('N/record/matrix',['N/utilityFunctions','N/error','N/record/recordUtilityFunctions'],function(utilityFunctions,error,recordUtil){function doGetMatrixHeaderCount(record,sublistId)
{return parseInt(record.getValue(sublistId+'headercount'),10)||0;}
function getMatrixHeaderFieldName(record,sublistId,column)
{var prefix=record.getValue(sublistId+'header');return prefix+column;}
function getMatrixFields(record,sublistId)
{var matrixfieldsvalue=record.getValue(sublistId+'matrixfields');return!!matrixfieldsvalue&&matrixfieldsvalue.split(',')||[];}
function isMatrixField(record,options,fieldId)
{var sublistId,undef=undefined;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;}
return utilityFunctions.arrayIndexOf(getMatrixFields(record,sublistId),fieldId)!==-1;}
function getMatrixLineFieldName(record,options,fieldId,column)
{var sublistId,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=options.column;}
return isMatrixField(record,sublistId,fieldId)?fieldId+"_"+column+"_":null;}
function getMatrixHeaderCount(record,options,fieldId)
{var sublistId,undef=undefined;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],record.getMissingArgumentErrorMessageFillerValue('getMatrixHeaderCount'));return isMatrixField(record,sublistId,fieldId)?doGetMatrixHeaderCount(record,sublistId):null;}
function getMatrixHeaderValue(record,options,fieldId,column)
{var matrixHeaderFieldName,sublistId,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"getMatrixHeaderValue");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"getMatrixHeaderValue");}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('getMatrixHeaderValue'));validateMatrixField(record,sublistId,fieldId);matrixHeaderFieldName=getMatrixHeaderFieldName(record,sublistId,column);return record.getValue(matrixHeaderFieldName);}
function setMatrixHeaderValue(record,options,fieldId,column,value,ignoreFieldChange)
{var sublistId,noSlaving=false,fireFieldChanged=true,matrixHeaderFieldName,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"setMatrixHeaderValue");fireFieldChanged=util.isBoolean(ignoreFieldChange)?!ignoreFieldChange:fireFieldChanged;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"setMatrixHeaderValue");value=options.value;fireFieldChanged=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChanged;}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('setMatrixHeaderValue'));validateMatrixField(record,sublistId,fieldId);matrixHeaderFieldName=getMatrixHeaderFieldName(record,sublistId,column);record.setValue(matrixHeaderFieldName,value,fireFieldChanged,noSlaving);return this;}
function getCurrentMatrixSublistValue(record,options,fieldId,column)
{var matrixLineFieldName,sublistId,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"getCurrentMatrixSublistValue");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"getCurrentMatrixSublistValue");}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('getCurrentMatrixSublistValue'));validateMatrixField(record,sublistId,fieldId);matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);return record.getCurrentSublistValue(sublistId,matrixLineFieldName,column);}
function setCurrentMatrixSublistValue(record,options,fieldId,column,value,ignoreFieldChange)
{var matrixLineFieldName,noSlaving=false,sublistId,fireFieldChanged=true,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"setCurrentMatrixSublistValue");fireFieldChanged=util.isBoolean(ignoreFieldChange)?!ignoreFieldChange:fireFieldChanged;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"setCurrentMatrixSublistValue");value=options.value;fireFieldChanged=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChanged;}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('setCurrentMatrixSublistValue'));validateMatrixField(record,sublistId,fieldId);matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);record.setCurrentSublistValue(sublistId,matrixLineFieldName,value,fireFieldChanged,noSlaving);return this;}
function getMatrixSublistValue(record,options,fieldId,linenum,column)
{var matrixLineFieldName,sublistId,undef=undefined;if(fieldId!==undef&&linenum!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"getMatrixSublistValue");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;linenum=options.line;column=recordUtil.validateAndGetOneBasedIndex(options.column,"getMatrixSublistValue");}
utilityFunctions.checkArgs([sublistId,fieldId,linenum,column],['sublistId','fieldId','line','column'],record.getMissingArgumentErrorMessageFillerValue('getMatrixSublistValue'));matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);validateMatrixFieldAndLine(record,sublistId,fieldId,linenum);return record.getSublistValue(sublistId,matrixLineFieldName,linenum);}
function setMatrixSublistValue(record,options,fieldId,linenum,column,value)
{var matrixLineFieldName,sublistId,undef=undefined;if(fieldId!==undef&&linenum!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"setMatrixSublistValue");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;linenum=options.line;column=recordUtil.validateAndGetOneBasedIndex(options.column,"setMatrixSublistValue");value=options.value;}
utilityFunctions.checkArgs([sublistId,fieldId,linenum,column],['sublistId','fieldId','line','column'],record.getMissingArgumentErrorMessageFillerValue('setMatrixSublistValue'));validateMatrixFieldAndLine(record,sublistId,fieldId,linenum);matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);record.setSublistValue(sublistId,matrixLineFieldName,linenum,value);return this;}
function findMatrixSublistLineWithValue(record,options,fieldId,column,value)
{var matrixLineFieldName,sublistId,undef=undefined;if(fieldId!==undef&&column!==undef&&value!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"findMatrixSublistLineWithValue");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"findMatrixSublistLineWithValue");value=options.value;}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('findMatrixSublistLineWithValue'));validateMatrixField(record,sublistId,fieldId);matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);return record.doFindSublistLineWithValue(sublistId,matrixLineFieldName,value);}
function getMatrixHeaderField(record,options,fieldId,column)
{var matrixHeaderFieldName,sublistId,undef=undefined;if(fieldId!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"getMatrixHeaderField");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;column=recordUtil.validateAndGetOneBasedIndex(options.column,"getMatrixHeaderField");}
utilityFunctions.checkArgs([sublistId,fieldId,column],['sublistId','fieldId','column'],record.getMissingArgumentErrorMessageFillerValue('getMatrixHeaderField'));validateMatrixField(record,sublistId,fieldId);matrixHeaderFieldName=getMatrixHeaderFieldName(record,sublistId,column);return record.getField(matrixHeaderFieldName);}
function getMatrixSublistField(record,options,fieldId,linenum,column)
{var matrixLineFieldName,sublistId,undef=undefined;if(fieldId!==undef&&linenum!==undef&&column!==undef)
{sublistId=options;column=recordUtil.validateAndGetOneBasedIndex(column,"getMatrixSublistField");}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;linenum=options.line;column=recordUtil.validateAndGetOneBasedIndex(options.column,"getMatrixSublistField");}
utilityFunctions.checkArgs([sublistId,fieldId,linenum,column],['sublistId','fieldId','line','column'],record.getMissingArgumentErrorMessageFillerValue('getMatrixSublistField'));matrixLineFieldName=getMatrixLineFieldName(record,sublistId,fieldId,column);return record.getSublistField(sublistId,matrixLineFieldName,linenum);}
function parseMatrixLineField(record,fieldId,sublistId)
{var result=null,fields,field,count,matrixLineFieldName,i;fields=getMatrixFields(record,sublistId);count=doGetMatrixHeaderCount(record,sublistId);for(i=0;i<fields.length;i++)
{field=fields[i];while(count-->0)
{matrixLineFieldName=getMatrixLineFieldName(record,sublistId,field,count);if(fieldId===matrixLineFieldName)
{result={sublistname:sublistId,fieldname:field,column:count};break;}}
if(!!result){break;}}
return result;}
function validateMatrixField(record,sublistId,fieldName)
{if(!isMatrixField(record,sublistId,fieldName))
utilityFunctions.throwSuiteScriptError(error.Type.METHOD_IS_ONLY_ALLOWED_FOR_MATRIX_FIELD);}
function validateMatrixFieldAndLine(record,sublistId,fieldName,lineNum)
{validateMatrixField(record,sublistId,fieldName);if(isNaN(lineNum)||(parseInt(lineNum,10)>=record.doGetLineCount(sublistId)))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SUBLIST_OPERATION);}
return Object.freeze({getMatrixHeaderFieldName:getMatrixHeaderFieldName,getMatrixFields:getMatrixFields,isMatrixField:isMatrixField,getMatrixLineFieldName:getMatrixLineFieldName,getMatrixHeaderCount:getMatrixHeaderCount,getMatrixHeaderValue:getMatrixHeaderValue,setMatrixHeaderValue:setMatrixHeaderValue,getCurrentMatrixSublistValue:getCurrentMatrixSublistValue,setCurrentMatrixSublistValue:setCurrentMatrixSublistValue,getMatrixSublistValue:getMatrixSublistValue,setMatrixSublistValue:setMatrixSublistValue,findMatrixSublistLineWithValue:findMatrixSublistLineWithValue,getMatrixHeaderField:getMatrixHeaderField,getMatrixSublistField:getMatrixSublistField,parseMatrixLineField:parseMatrixLineField})});define('N/record/sublist',['N/nsobject'],function(nsobject){var SUBLIST_TYPE=Object.freeze({INLINE_EDITOR:'inlineeditor',EDITOR:'editor',STATIC_LIST:'staticlist',LIST:'list'});function Sublist(sublist)
{var that=this;var sublistType=sublist.type;var sublistState=sublist.sublistState;var sublistFieldsMetadata=sublist.sublistFields;this.getName=function(){return sublistState.id;};this.getType=function(){return sublistType;};this.isChanged=function(){return sublistState.isChanged;};this.isHidden=function(){return sublistState.isHidden};this.isDisplay=function(){return sublistState.isDisplay;};this.isMultilineEditable=function(){return sublistState.isMultilineEditable;};this.getColumn=function(fieldId)
{var columnMetadata=null;if(sublistFieldsMetadata.hasOwnProperty(fieldId))
{var fieldLevelMetadata=sublistFieldsMetadata[fieldId];columnMetadata={getName:function(){return fieldLevelMetadata.name},getType:function(){return fieldLevelMetadata.type},getLabel:function(){return fieldLevelMetadata.label},setLabel:function(newLabel){fieldLevelMetadata.label=newLabel;},getSublistId:function(){return sublistState.id}};}
return columnMetadata;};this.toString=function(){return "record.Sublist"};this.toJSON=function(){return{id:this.id,type:this.type,isChanged:this.isChanged,isDisplay:this.isDisplay,isMultilineEditable:this.isMultilineEditable}};return this;}
Sublist.prototype=nsobject.getNewInstance();Object.freeze(Sublist);function SublistV1(sublist)
{this.getName=function(){return sublist.getName();};this.isChanged=function(){return sublist.isChanged();};this.getSublistType=function(){return sublist.getType();};this.getType=function(){return sublist.getType();};this.isDisplay=function(){return sublist.isDisplay();};this.setDisplay=function(val){};this.isHidden=function(){return sublist.isHidden();};this.setHidden=function(val){};return this;}
SublistV1.prototype=nsobject.getNewInstance();Object.freeze(SublistV1);return Object.freeze({create:function(sublist){return new Sublist(sublist);},newInstanceOfV1Sublist:function(sublistJson){var sublist=new Sublist(sublistJson);return new SublistV1(sublist);},Type:SUBLIST_TYPE})});define('N/metadata/sublistDefinition',['N/restricted/invoker','N/utilityFunctions','N/nsobject','N/error'],function(invoker,utilityFunctions,nsobject,error){var SUBLIST_CATEGORY=Object.freeze({REMOTE:"remoteRecord",CURRENT:"currentRecord",READ_ONLY:"readOnlyRecord"});var SUBLIST_PROPERTIES=Object.freeze({ID:"id",TYPE:"type",IS_CHANGED:"isChanged",IS_DISPLAY:"isDisplay",IS_MULTILINE_EDITABLE:"isMultilineEditable",GET_COLUMN:"getColumn",GET_COLUMNS:"getColumns"});var COLUMN_PROPERTIES=Object.freeze({COLUMN_METADATA:"columnMetadata",ID:"id",TYPE:"type",LABEL:"label",SUBLIST_ID:"sublistId"});var ACCESS_LEVEL=Object.freeze({NONE:0,READ_ONLY:1,READ_WRITE:2});function Sublist(sublistDelegate,permissions)
{function authorizeThenWrite(accessLevel,setFunction,propertyName)
{if(accessLevel===ACCESS_LEVEL.READ_WRITE)
{setFunction();}
else
{utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,propertyName);}}
function noAction(){}
if(permissions[SUBLIST_PROPERTIES.ID]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,SUBLIST_PROPERTIES.ID,{get:function()
{return sublistDelegate.getName();},set:function(val)
{authorizeThenWrite(permissions[SUBLIST_PROPERTIES.ID],noAction,"Sublist."+SUBLIST_PROPERTIES.ID);},enumerable:true,configurable:false});}
if(permissions[SUBLIST_PROPERTIES.TYPE]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,SUBLIST_PROPERTIES.TYPE,{get:function()
{return sublistDelegate.getType();},set:function(val)
{authorizeThenWrite(permissions[SUBLIST_PROPERTIES.TYPE],noAction,"Sublist."+SUBLIST_PROPERTIES.TYPE);},enumerable:true,configurable:false});}
if(permissions[SUBLIST_PROPERTIES.IS_CHANGED]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,SUBLIST_PROPERTIES.IS_CHANGED,{get:function()
{return sublistDelegate.isChanged();},set:function(val)
{authorizeThenWrite(permissions[SUBLIST_PROPERTIES.IS_CHANGED],noAction,"Sublist."+SUBLIST_PROPERTIES.IS_CHANGED);},enumerable:true,configurable:false});}
if(permissions[SUBLIST_PROPERTIES.IS_DISPLAY]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,SUBLIST_PROPERTIES.IS_DISPLAY,{get:function()
{return sublistDelegate.isDisplay();},set:function(val)
{authorizeThenWrite(permissions[SUBLIST_PROPERTIES.IS_DISPLAY],noAction,"Sublist."+SUBLIST_PROPERTIES.IS_DISPLAY);},enumerable:true,configurable:false});}
if(permissions[SUBLIST_PROPERTIES.IS_MULTILINE_EDITABLE]>ACCESS_LEVEL.NONE)
{Object.defineProperty(this,SUBLIST_PROPERTIES.IS_MULTILINE_EDITABLE,{get:function()
{return sublistDelegate.isMultilineEditable();},set:function(val)
{authorizeThenWrite(permissions[SUBLIST_PROPERTIES.IS_MULTILINE_EDITABLE],noAction,"Sublist."+SUBLIST_PROPERTIES.IS_MULTILINE_EDITABLE);},enumerable:true,configurable:false});}
if(permissions[SUBLIST_PROPERTIES.GET_COLUMN]>ACCESS_LEVEL.NONE)
{this.getColumn=function(options)
{var undef=undefined,fieldId=options!==undef&&options!==null&&options.fieldId!==undef?options.fieldId:options;utilityFunctions.checkArgs([fieldId],['fieldId'],'sublist.getColumn');var columnInfo=sublistDelegate.getColumn(fieldId);return!columnInfo?null:Object.freeze(new Column(columnInfo));}}
if(permissions[SUBLIST_PROPERTIES.GET_COLUMNS]>ACCESS_LEVEL.NONE)
{this.getColumns=sublistDelegate.getColumns;}
this.toString=function()
{return "sublist.Sublist"};this.toJSON=function()
{return{id:this.id,type:this.type,isChanged:this.isChanged,isDisplay:this.isDisplay}};function Column(columnDelegate)
{var columnPermissions=permissions[COLUMN_PROPERTIES.COLUMN_METADATA];Object.defineProperty(this,COLUMN_PROPERTIES.ID,{get:function()
{return columnDelegate.getName();},set:function(val)
{authorizeThenWrite(columnPermissions[COLUMN_PROPERTIES.ID],noAction,"Column."+COLUMN_PROPERTIES.ID);},enumerable:true,configurable:false});Object.defineProperty(this,COLUMN_PROPERTIES.TYPE,{get:function()
{return columnDelegate.getType();},set:function(val)
{authorizeThenWrite(columnPermissions[COLUMN_PROPERTIES.TYPE],noAction,"Column."+COLUMN_PROPERTIES.TYPE);},enumerable:true,configurable:false});Object.defineProperty(this,COLUMN_PROPERTIES.LABEL,{get:function()
{return columnDelegate.getLabel();},set:function(val)
{var setFunction=function()
{columnDelegate.setLabel(val);};authorizeThenWrite(columnPermissions[COLUMN_PROPERTIES.LABEL],setFunction,"Column."+COLUMN_PROPERTIES.LABEL);},enumerable:true,configurable:false});Object.defineProperty(this,COLUMN_PROPERTIES.SUBLIST_ID,{get:function()
{return columnDelegate.getSublistId();},set:function(val)
{authorizeThenWrite(columnPermissions[COLUMN_PROPERTIES.SUBLIST_ID],noAction,"Column."+COLUMN_PROPERTIES.SUBLIST_ID);},enumerable:true,configurable:false});this.toString=function()
{return "sublist.Column"};this.toJSON=function()
{return{id:this.id,type:this.type,label:this.label,sublistId:this.sublistId}};}
Column.prototype=nsobject.getNewInstance();Object.freeze(Column);}
Sublist.prototype=nsobject.getNewInstance();Object.freeze(Sublist);return Object.freeze({Category:SUBLIST_CATEGORY,Property:SUBLIST_PROPERTIES,Column:COLUMN_PROPERTIES,Access:ACCESS_LEVEL,create:function(delegate,permissions)
{return!delegate?null:Object.freeze(new Sublist(delegate,permissions));}});});define('N/metadata/sublistPermissions',['N/metadata/sublistDefinition'],function(sublistDef){var sublistRemoteRecord={};sublistRemoteRecord[sublistDef.Property.ID]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.TYPE]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.IS_CHANGED]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.IS_DISPLAY]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.IS_MULTILINE_EDITABLE]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.GET_COLUMN]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Property.GET_COLUMNS]=sublistDef.Access.NONE;sublistRemoteRecord[sublistDef.Column.COLUMN_METADATA]={};sublistRemoteRecord[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.ID]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.TYPE]=sublistDef.Access.READ_ONLY;sublistRemoteRecord[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.LABEL]=sublistDef.Access.READ_WRITE;sublistRemoteRecord[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.SUBLIST_ID]=sublistDef.Access.READ_ONLY;var readOnlySublist={};readOnlySublist[sublistDef.Property.ID]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.TYPE]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.IS_CHANGED]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.IS_DISPLAY]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.IS_MULTILINE_EDITABLE]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.GET_COLUMN]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Property.GET_COLUMNS]=sublistDef.Access.NONE;readOnlySublist[sublistDef.Column.COLUMN_METADATA]={};readOnlySublist[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.ID]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.TYPE]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.LABEL]=sublistDef.Access.READ_ONLY;readOnlySublist[sublistDef.Column.COLUMN_METADATA][sublistDef.Column.SUBLIST_ID]=sublistDef.Access.READ_ONLY;var sublistCurrentRecord={};sublistCurrentRecord[sublistDef.Property.ID]=sublistDef.Access.READ_ONLY;sublistCurrentRecord[sublistDef.Property.TYPE]=sublistDef.Access.READ_ONLY;sublistCurrentRecord[sublistDef.Property.IS_CHANGED]=sublistDef.Access.READ_ONLY;sublistCurrentRecord[sublistDef.Property.IS_DISPLAY]=sublistDef.Access.READ_ONLY;sublistCurrentRecord[sublistDef.Property.IS_MULTILINE_EDITABLE]=sublistDef.Access.READ_ONLY;sublistCurrentRecord[sublistDef.Property.GET_COLUMN]=sublistDef.Access.NONE;sublistCurrentRecord[sublistDef.Property.GET_COLUMNS]=sublistDef.Access.NONE;var masterPermission={};masterPermission[sublistDef.Category.REMOTE]=sublistRemoteRecord;masterPermission[sublistDef.Category.CURRENT]=sublistCurrentRecord;masterPermission[sublistDef.Category.READ_ONLY]=readOnlySublist;return Object.freeze(masterPermission);});define('N/metadata/sublistMetadata',['N/utilityFunctions','N/metadata/sublistDefinition','N/metadata/sublistPermissions'],function(utilityFunctions,sublistDef,sublistPermissions){function wrap(options)
{var sublistCategory=options.category||null,delegate=options.delegate||null;utilityFunctions.checkArgs([sublistCategory,delegate],["sublistCategory","delegate"],"sublistMetadata");return sublistDef.create(delegate,sublistPermissions[sublistCategory]);}
return Object.freeze({Category:sublistDef.Category,wrap:wrap});});define('N/record/line/dynamicLine',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/error','N/environment'],function(nsobject,constants,utilityFunctions,error,environment)
{var proxyOptions=Object.freeze({isInteractive:true});function DynamicLine(line)
{utilityFunctions.addReadOnlyProperty(this,'instanceId',line.getLineInstanceId);utilityFunctions.addReadOnlyProperty(this,'sublistId',line.getSublistId);utilityFunctions.addReadOnlyProperty(this,'sequence',line.getSequence);utilityFunctions.addReadOnlyProperty(this,'record',getRecord);function getRecord()
{return line.getRecord().proxy(proxyOptions);}
this.cancel=line.cancel;this.commit=line.commit;this.getFields=line.getFields;this.getField=line.getField;this.getValue=line.getValue;this.setValue=line.setValue;this.getText=line.getText;this.setText=line.setText;this.hasSubrecord=line.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=line.getSubrecord.apply(line,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeSubrecord=line.removeSubrecord;this.makeCopy=line.makeCopy;this.on=line.on;this.off=line.off;this.toJSON=line.toJSON;this.toString=function(){return constants.LINE_MODE.DYNAMIC_LINE;};return this;}
DynamicLine.prototype=nsobject.getNewInstance();Object.freeze(DynamicLine);return DynamicLine;});define('N/record/line/deferredDynamicLine',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/error','N/environment'],function(nsobject,constants,utilityFunctions,error,environment)
{var proxyOptions=Object.freeze({isInteractive:true});function DeferredDynamicLine(line)
{utilityFunctions.addReadOnlyProperty(this,'instanceId',line.getLineInstanceId);utilityFunctions.addReadOnlyProperty(this,'sublistId',line.getSublistId);utilityFunctions.addReadOnlyProperty(this,'sequence',line.getSequence);utilityFunctions.addReadOnlyProperty(this,'record',getRecord);function getRecord()
{return line.getRecord().proxy(proxyOptions);}
this.getFields=line.getFields;this.getField=line.getField;this.getValue=line.getValue;this.setValue=line.setValue;this.getText=line.getText;this.setText=line.setText;this.hasSubrecord=line.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=line.getSubrecord.apply(line,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeSubrecord=line.removeSubrecord;this.makeCopy=line.makeCopy;this.toJSON=line.toJSON;this.toString=function(){return constants.LINE_MODE.DEFERRED_DYNAMIC_LINE;};return this;}
DeferredDynamicLine.prototype=nsobject.getNewInstance();Object.freeze(DeferredDynamicLine);return DeferredDynamicLine;});define('N/record/line/readOnlyLine',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/error','N/environment'],function(nsobject,constants,utilityFunctions,error,environment)
{var proxyOptions=Object.freeze({isInteractive:true});function ReadOnlyLine(line)
{utilityFunctions.addReadOnlyProperty(this,'instanceId',line.getLineInstanceId);utilityFunctions.addReadOnlyProperty(this,'sublistId',line.getSublistId);utilityFunctions.addReadOnlyProperty(this,'sequence',line.getSequence);utilityFunctions.addReadOnlyProperty(this,'record',getRecord);function getRecord()
{return line.getRecord().proxy(proxyOptions);}
this.getFields=line.getFields;this.getField=line.getField;this.getValue=line.getValue;this.getText=line.getText;this.hasSubrecord=line.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=line.getSubrecord.apply(line,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.makeCopy=line.makeCopy;this.toJSON=line.toJSON;this.toString=function(){return constants.LINE_MODE.READ_ONLY_LINE;};return this;}
ReadOnlyLine.prototype=nsobject.getNewInstance();Object.freeze(ReadOnlyLine);return ReadOnlyLine;});define('N/record/line/lineProxy',['N/record/recordConstants','N/record/line/dynamicLine','N/record/line/deferredDynamicLine','N/record/line/readOnlyLine'],function(constants,DynamicLine,DeferredDynamicLine,ReadOnlyLine)
{function wrap(options)
{var wrappedLine;var line=options.delegate;var isReadOnly=!!options.isReadOnly;var isDynamic=!!options.isDynamic;if(isReadOnly)
{wrappedLine=new ReadOnlyLine(line);}
else if(!isDynamic)
{wrappedLine=new DeferredDynamicLine(line);}
else if(isDynamic)
{wrappedLine=new DynamicLine(line);}
return wrappedLine;}
return{wrap:wrap};});define('N/common/record/recordActualWork',['N/record/recordUtilityFunctions','N/utilityFunctions','N/util/formatter','N/util/validator'],function(recordUtil,utilityFunctions,formatter,validator)
{var undef=undefined;var IS_CHANGED=true;var FIELD_ID="fieldId";var SUBLIST_ID="sublistId";var METHOD_GET_FIELD="getField";var METHOD_GET_FIELDS="getFields";var METHOD_GET_VALUE="getValue";var METHOD_SET_VALUE="setValue";var METHOD_GET_TEXT="getText";var METHOD_SET_TEXT="setText";var METHOD_HAS_SUBRECORD="hasSubrecord";var METHOD_GET_SUBRECORD="getSubrecord";var METHOD_REMOVE_SUBRECORD="removeSubrecord";function RecordBehaviorDelegate(options)
{var delegate=options.delegate;function getFieldState(fieldId)
{return delegate.getFieldState(fieldId);}
function getFieldLevelMetadata(fieldId)
{return delegate.getFieldLevelMetadataForBodyField(fieldId);}
function isValidField(fieldId)
{return delegate.isValidBodyField(fieldId);}
function getField(options)
{var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_GET_FIELD));return delegate.doGetField(fieldId,this);}
this.getField=getField;function getFields()
{return delegate.doGetFields();}
this.getFields=getFields;function getValue(options)
{var isTextApi=false;var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_GET_VALUE));delegate.validateTextApi(isTextApi,getFieldState(fieldId),METHOD_SET_TEXT,METHOD_GET_TEXT);return delegate.getParsedValueForBodyField(fieldId,this);}
this.getValue=getValue;function setValue(options,value)
{var fieldId,fireFieldChange=true;if(value!==undef||(options!==undef&&options.fieldId===undef&&typeof options==='string'))
{fieldId=options;}
else if(options!==undef&&options!==null)
{fieldId=options.fieldId;value=options.value;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;}
utilityFunctions.checkArgs([fieldId],[FIELD_ID],delegate.getMissingArgumentErrorMessageFillerValue(METHOD_SET_VALUE));recordUtil.validateAgainstSqlInjection(fieldId,value);delegate.doSetValue(fieldId,value,fireFieldChange,this);}
this.setValue=setValue;function getText(options)
{var isTextApi=true;var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_GET_TEXT));delegate.validateTextApi(isTextApi,getFieldState(fieldId),METHOD_SET_VALUE,METHOD_GET_VALUE);return delegate.doGetText(fieldId,this);}
this.getText=getText;function setText(options,text)
{var fieldId,fireFieldChange=true;if(text!==undef||(options!==undef&&options.fieldId===undef&&typeof options==='string'))
{fieldId=options;}
else if(options!==undef&&options!==null)
{fieldId=options.fieldId;text=options.text;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;}
delegate.getMissingArgumentErrorMessageFillerValue(METHOD_GET_TEXT);utilityFunctions.checkArgs([fieldId],[FIELD_ID],delegate.getMissingArgumentErrorMessageFillerValue(METHOD_SET_TEXT));text=recordUtil.emptyIfNullOrUndefined(text);recordUtil.validateAgainstSqlInjection(fieldId,text);delegate.doSetText(fieldId,text,fireFieldChange,this);}
this.setText=setText;function getParsedValue(fieldId)
{var returnValue=delegate.doGetValue(fieldId);var fs=getFieldState(fieldId);var fieldLevelMetadata=getFieldLevelMetadata(fieldId);var isCheckbox=fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.CHECKBOX;if((fs&&!fs.isParsed)||(isCheckbox&&returnValue===""))
{var isFieldValid=isValidField(fieldId);var parsedValue=delegate.parseValue(isFieldValid,fieldLevelMetadata,returnValue);if(isFieldValid||parsedValue!==undefined)
delegate.setParsedValueAndUpdateFieldState(fieldId,parsedValue,fs);returnValue=parsedValue;}
return returnValue;}
this.getParsedValue=getParsedValue;function getTextValue(fieldId)
{var useBuffer=false;var lineInstanceId=null;return getTextValueForInstance(undef,fieldId,lineInstanceId,useBuffer)}
this.getTextValue=getTextValue;function getTextValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var setFieldMetadata=delegate.getSetFieldMetadata(sublistId,fieldId);var fieldLevelMetadata=delegate.extractInforFromFieldLevelMetadata(sublistId,fieldId);var value=getParsedValue(fieldId);return doGetTextValueForInstance(delegate.getHack(),value,lineInstanceId,useBuffer,setFieldMetadata,fieldLevelMetadata);}
this.getTextValueForInstance=getTextValueForInstance;function commit()
{return delegate.doCommit();}
this.commit=commit;function cancel()
{return delegate.doCancel();}
this.cancel=cancel;function hasSubrecord(options)
{var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_HAS_SUBRECORD));return delegate.doHasSubrecord(fieldId);}
this.hasSubrecord=hasSubrecord;function getSubrecord(options)
{var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_GET_SUBRECORD));return delegate.doGetSubrecord(fieldId);}
this.getSubrecord=getSubrecord;function removeSubrecord(options)
{var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,FIELD_ID,delegate.getMissingArgumentErrorMessageFillerValue(METHOD_REMOVE_SUBRECORD));return delegate.doRemoveSubrecord(fieldId);}
this.removeSubrecord=removeSubrecord;function makeCopy()
{return delegate.doMakeCopy();}
this.makeCopy=makeCopy;}
function create(options)
{return new RecordBehaviorDelegate(options);}
function updateSubrecordStates(record)
{var subrecordSublistState=record.getSubrecordSublistState();var subrecordFieldState=record.getSubrecordFieldState();if(subrecordSublistState!=null)
subrecordSublistState.isChanged=IS_CHANGED;if(subrecordFieldState!=null)
subrecordFieldState.isChanged=IS_CHANGED;}
function formatValueAsText(value,metadata)
{var returnMe;if(util.isArray(value))
{returnMe=value.map(function(val)
{return recordUtil.formatArrayToStringType(val);});}
else
{returnMe=formatFieldWithEmptyValueOrSelectTypeOrVirtualField(value,metadata);if(returnMe===null)
{returnMe=doFormatValue(value,metadata);}}
return returnMe;}
function formatFieldWithEmptyValueOrSelectTypeOrVirtualField(value,metadata)
{var fieldType=metadata.type||null;var formattedValue=null;if(!value&&value!==""&&value!==0&&!util.isBoolean(value))
formattedValue="";else if(metadata.isMultiSelect&&util.isArray(value))
formattedValue=value.join(String.fromCharCode(5));else if(metadata.isSelect||fieldType===null)
formattedValue=String(value);return formattedValue;}
function needsToBeFormattedForLegacySave(metadata,value)
{return util.isDate(value)||util.isBoolean(value)||metadata.type===recordUtil.FIELD_TYPE.TIME||metadata.type===recordUtil.FIELD_TYPE.TIMETRACK;}
function doFormatValue(value,metadata)
{var fieldType=metadata.type||null;var isNumeric=metadata.isNumeric||false;var isCurrency=metadata.isCurrency||false;var formattedValue=formatter.format(value,fieldType,isNumeric,isCurrency);return formattedValue?String(formattedValue):formattedValue;}
function formatValueForLegacySyntheticRequest(value,metadata)
{var formattedValue=formatFieldWithEmptyValueOrSelectTypeOrVirtualField(value,metadata);if(formattedValue===null||formattedValue===undef)
{if(needsToBeFormattedForLegacySave(metadata,value))
formattedValue=doFormatValue(value,metadata);else
formattedValue=String(value)}
return formattedValue;}
function postDoSetSublistValueForInstance(record,sublistId,fieldId,lineInstanceId,useBuffer)
{record.invalidateSubrecordClones();record.getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer).isChanged=IS_CHANGED;updateSubrecordStates(record);}
function postDoSetValueForInstance(record,postSetObject,lineInstanceId,useBuffer)
{record.invalidateSubrecordClones();record.postSetFieldValueForInstance(postSetObject.sublistId,postSetObject.fieldId,lineInstanceId,useBuffer,postSetObject.dbValue,postSetObject.fireFieldChange,postSetObject.noSlaving,postSetObject.isUpdatingSlavingField);updateSubrecordStates(record);}
function createObjectToDoSetSublistValue(val,metadata)
{var value=recordUtil.emptyIfNullOrUndefined(val);var dbValue=formatValueForLegacySyntheticRequest(value,metadata);return{value:value,legacyStringValue:dbValue};}
function createObjectToDoSetValue(val,metadata)
{var dbValue;if(metadata.valueIsFormattedAsString)
dbValue=(val!==null)?String(val):null;else
dbValue=formatValueForLegacySyntheticRequest(val,metadata);return{value:val,legacyStringValue:dbValue};}
function preDoSetSublistBufferValue(record,lineInstanceId,value,metadata)
{var useBuffer=true;value=recordUtil.emptyIfNullOrUndefined(value);if(!!metadata.isMultiSelect)
value=recordUtil.formatValueToArrayType(value);else if(!!metadata.isRadio)
value=String(value);return record.validateAndFormatFieldValueForInstance(metadata.sublistId,metadata.fieldId,lineInstanceId,useBuffer,value,metadata.isInteractive);}
function getTextValueForRadioField(value,fieldLevelMetadata)
{var returnText="";if(fieldLevelMetadata.radioSet)
returnText=fieldLevelMetadata.radioSet[value];else if(fieldLevelMetadata.hasBlankString)
returnText=fieldLevelMetadata.blankString;return returnText;}
function getTextValueForSelectField(record,value,lineInstanceId,useBuffer,fieldLevelMetadata)
{var returnText="";var isMulti=false;if(util.trim(value)||value===0||value===false)
{if(Array.isArray(fieldLevelMetadata.supplementedOptions))
returnText=record.doGetTextValueForSupplementedSelectFieldForInstance(fieldLevelMetadata.sublistId,fieldLevelMetadata.fieldId,value,lineInstanceId,useBuffer,isMulti);else
returnText=record.doGetTextValueForSelectFieldForInstance(fieldLevelMetadata.sublistId,fieldLevelMetadata.fieldId,value,lineInstanceId,useBuffer,isMulti);}
else if(fieldLevelMetadata.hasBlankString)
returnText=fieldLevelMetadata.blankString;return returnText;}
function getTextValueForMultiSelectFieldForInstance(record,value,lineInstanceId,useBuffer,fieldLevelMetadata)
{var returnText="";var isMulti=true;if(value||value===0||value===false)
returnText=record.doGetTextValueForSelectFieldForInstance(fieldLevelMetadata.sublistId,fieldLevelMetadata.fieldId,value,lineInstanceId,useBuffer,isMulti);else if(fieldLevelMetadata.hasBlankString)
returnText=fieldLevelMetadata.blankString;return returnText?String(returnText).split(String.fromCharCode(5)):[];}
function doGetTextValueForInstance(record,value,lineInstanceId,useBuffer,metadata,fieldLevelMetadata)
{var formattedValue;if(!metadata.isValidField||value===undef||value===null)
formattedValue=value;else if(metadata.isMultiSelect)
formattedValue=getTextValueForMultiSelectFieldForInstance(record,value,lineInstanceId,useBuffer,fieldLevelMetadata);else if(metadata.isSelect)
formattedValue=getTextValueForSelectField(record,value,lineInstanceId,useBuffer,fieldLevelMetadata);else if(metadata.isRadio)
formattedValue=getTextValueForRadioField(value,fieldLevelMetadata);else
formattedValue=formatValueAsText(value,metadata);return formattedValue;}
function handleMultiSelectAndVirtualFieldForReturnValue(value,metadata)
{var returnMe;if(metadata.hasFieldExisted)
returnMe=(metadata.isMultiSelect&&!value&&value!==0)?[]:value;else
returnMe=undef;return returnMe;}
function getValueOrValuesForSelect(record,sublistId,fieldId,text,lineInstanceId,isMultiSelect,useBuffer)
{var returnMe="";var rf;record.validateIfSublistIdEditableAndInstanceIdValid(sublistId,lineInstanceId,useBuffer);if(isMultiSelect)
{returnMe=recordUtil.formatValueToArrayType(text);rf=record.getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);returnMe=rf.validateSelectFieldByText(returnMe);}
else
{var unwrappedText=recordUtil.formatArrayToStringType(text);if(unwrappedText||unwrappedText==="")
{rf=record.getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);returnMe=rf.validateSelectFieldByText(unwrappedText);}}
return returnMe;}
function convertTextToValueForSetText(record,sublistId,fieldId,lineInstanceId,text,metadata,useBuffer)
{var value;if(metadata.isMultiSelect||metadata.isSelect)
value=getValueOrValuesForSelect(record,sublistId,fieldId,text,lineInstanceId,metadata.isMultiSelect,useBuffer);else if(metadata.isRadio)
value=validator.validateRadioFieldByText(fieldId,text,metadata.radioSet);else
{var fieldLevelMetadata=record.getMetadata().getFieldMetadata(sublistId,fieldId);if(fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.TIME)
validator.validateField(fieldId,"text",text,false,false,undefined,undefined,undefined,fieldLevelMetadata.maxLength,false,true);value=record.parseValue(metadata.isValidField,fieldLevelMetadata,text);}
return value;}
return{create:create,createObjectToDoSetSublistValue:createObjectToDoSetSublistValue,createObjectToDoSetValue:createObjectToDoSetValue,postDoSetSublistValueForInstance:postDoSetSublistValueForInstance,postDoSetValueForInstance:postDoSetValueForInstance,handleMultiSelectAndVirtualFieldForReturnValue:handleMultiSelectAndVirtualFieldForReturnValue,preDoSetSublistBufferValue:preDoSetSublistBufferValue,convertTextToValueForSetText:convertTextToValueForSetText}});define('N/record/line/sublistLineImpl',[],function(){function SublistLineImpl(line){var useBuffer=false;function getSublistId()
{return line.getSublistId();}
function getLineInstanceId()
{return line.getLineInstanceId();}
function getParentRecord(){return line.getUnproxiedRecord();}
function getFieldState(fieldId)
{return getParentRecord().getSublistFieldStateForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.getFieldState=getFieldState;function getParsedValueForBodyField(fieldId,delegator)
{return getParentRecord().doGetParsedSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function setParsedValueForBodyField(fieldId,value)
{getParentRecord().setParsedValueForSublistFieldForInstance(getSublistId(),getLineInstanceId(),fieldId,value,useBuffer);}
this.setParsedValueForBodyField=setParsedValueForBodyField;function doGetValue(fieldId)
{return getParentRecord().doGetSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.doGetValue=doGetValue;function doGetText(fieldId,delegator)
{return getParentRecord().doGetSublistTextForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.doGetText=doGetText;function doSetValue(fieldId,value,fireFieldChange)
{return getParentRecord().doSetSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),value,fireFieldChange,useBuffer);}
this.doSetValue=doSetValue;function doSetText(fieldId,text,fireFieldChange)
{var noSlaving=false;var isUpdatingSlavingField=false;return getParentRecord().doSetSublistTextForInstance(getSublistId(),fieldId,getLineInstanceId(),text,fireFieldChange,noSlaving,isUpdatingSlavingField,useBuffer);}
this.doSetText=doSetText;function doGetField(fieldId,delegator)
{return getParentRecord().doGetFieldForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.doGetField=doGetField;function doGetFields()
{return getParentRecord().getSublistFields(getSublistId());}
this.doGetFields=doGetFields;function doCommit()
{return getParentRecord().commitLineForInstance(getSublistId(),getLineInstanceId());}
this.doCommit=doCommit;function doCancel()
{return getParentRecord().cancelLineForInstance(getSublistId(),getLineInstanceId());}
this.doCancel=doCancel;function hasSubrecord(fieldId)
{return getParentRecord().doHasSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.hasSubrecord=hasSubrecord;function getSubrecord(fieldId)
{return getParentRecord().doGetSublistSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.getSubrecord=getSubrecord;function removeSubrecord(fieldId)
{return getParentRecord().doRemoveSublistSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.removeSubrecord=removeSubrecord;function makeCopy()
{return getParentRecord().makeCopyForInstance(getSublistId(),getLineInstanceId(),useBuffer);}
this.makeCopy=makeCopy;}
function create(line)
{return new SublistLineImpl(line);}
return{create:create};});define('N/record/line/sublistLineBufferImpl',[],function(){function SublistLineBufferImpl(line){var useBuffer=true;function getSublistId()
{return line.getSublistId();}
function getLineInstanceId()
{return line.getLineInstanceId();}
function getParentRecord(){return line.getUnproxiedRecord();}
function getFieldState(fieldId)
{return getParentRecord().getSublistFieldStateForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.getFieldState=getFieldState;function getParsedValueForBodyField(fieldId,delegator)
{return getParentRecord().doGetParsedSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function setParsedValueForBodyField(fieldId,value)
{getParentRecord().setParsedValueForSublistFieldForInstance(getSublistId(),getLineInstanceId(),fieldId,value,useBuffer);}
this.setParsedValueForBodyField=setParsedValueForBodyField;function doGetValue(fieldId)
{return getParentRecord().doGetSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.doGetValue=doGetValue;function doGetText(fieldId,delegator)
{return getParentRecord().doGetSublistTextForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.doGetText=doGetText;function doSetValue(fieldId,value,fireFieldChange)
{return getParentRecord().doSetSublistValueForInstance(getSublistId(),fieldId,getLineInstanceId(),value,fireFieldChange,useBuffer);}
this.doSetValue=doSetValue;function doSetText(fieldId,text,fireFieldChange)
{var noSlaving=false;var isUpdatingSlavingField=false;return getParentRecord().doSetSublistTextForInstance(getSublistId(),fieldId,getLineInstanceId(),text,fireFieldChange,noSlaving,isUpdatingSlavingField,useBuffer);}
this.doSetText=doSetText;function doGetField(fieldId,delegator)
{return getParentRecord().doGetFieldForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer,delegator);}
this.doGetField=doGetField;function doGetFields()
{return getParentRecord().getSublistFields(getSublistId());}
this.doGetFields=doGetFields;function doCommit()
{return getParentRecord().commitLineForInstance(getSublistId(),getLineInstanceId());}
this.doCommit=doCommit;function doCancel()
{return getParentRecord().cancelLineForInstance(getSublistId(),getLineInstanceId());}
this.doCancel=doCancel;function hasSubrecord(fieldId)
{return getParentRecord().doHasSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.hasSubrecord=hasSubrecord;function getSubrecord(fieldId)
{return getParentRecord().doGetSublistSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.getSubrecord=getSubrecord;function removeSubrecord(fieldId)
{return getParentRecord().doRemoveSublistSubrecordForInstance(getSublistId(),fieldId,getLineInstanceId(),useBuffer);}
this.removeSubrecord=removeSubrecord;function makeCopy()
{return getParentRecord().makeCopyForInstance(getSublistId(),getLineInstanceId(),useBuffer);}
this.makeCopy=makeCopy;}
function create(line)
{return new SublistLineBufferImpl(line);}
return{create:create};});define('N/record/line/sublistLineImplementation',['N/record/line/sublistLineImpl','N/record/line/sublistLineBufferImpl'],function(sublistLineImpl,sublistLineBufferImpl){function create(options)
{var useBuffer=options.useBuffer;var line=options.line;return!useBuffer?sublistLineImpl.create(line):sublistLineBufferImpl.create(line);}
return{create:create};});define('N/record/recordEvent',[],function(){var EVENT_TYPE=Object.freeze({ERROR:'ERROR',UPDATE_ALL:'UPDATE_ALL',RECORD_INITIALIZED:'RECORD_INITIALIZED',UPDATE_FIELD_VALUE:'UPDATE_FIELD_VALUE',UPDATE_FIELD_OPTIONS:'UPDATE_FIELD_OPTIONS',UPDATE_SUBLIST:'UPDATE_SUBLIST',CREATE_LINE:'CREATE_LINE',UPDATE_LINE:'UPDATE_LINE',INSERT_LINE:'INSERT_LINE',REMOVE_LINE:'REMOVE_LINE',SELECT_LINE:'SELECT_LINE',UPDATE_RELATED_RECORD_VIEW:'UPDATE_RELATED_RECORD_VIEW',FIELD_IS_MANDATORY_CHANGE:'FIELD_IS_MANDATORY_CHANGE',FIELD_IS_HIDDEN_CHANGE:'FIELD_IS_HIDDEN_CHANGE',FIELD_IS_DISABLED_CHANGE:'FIELD_IS_DISABLED_CHANGE',FIELD_IS_VISIBLE_CHANGE:'FIELD_IS_VISIBLE_CHANGE',FIELD_IS_DISPLAY_CHANGE:'FIELD_IS_DISPLAY_CHANGE',FIELD_IS_READ_ONLY_CHANGE:'FIELD_IS_READ_ONLY_CHANGE',FIELD_LABEL_CHANGE:'FIELD_LABEL_CHANGE',SUBLIST_IS_DISPLAY_CHANGE:'SUBLIST_IS_DISPLAY_CHANGE',SUBLIST_IS_HIDDEN_CHANGE:'SUBLIST_IS_HIDDEN_CHANGE',SUBLIST_COLUMN_LABEL_CHANGE:'SUBLIST_COLUMN_LABEL_CHANGE',VALIDATION_FAILED:'VALIDATION_FAILED'});return Object.freeze({Type:EVENT_TYPE});});define('N/record/sublistLineEvent',[],function()
{var EVENT_TYPE=Object.freeze({FIELD_VALUE_CHANGE:'FIELD_VALUE_CHANGE'});function getEvent(sublistLine,fieldId,type)
{return{type:type,sublistLine:sublistLine,fieldId:fieldId};}
function addFieldValues(event,oldValue,newValue)
{event.oldValue=oldValue;if(newValue!==undefined)
{event.newValue=newValue;}
return event;}
function addInternalFlag(event,isInternalChange)
{if(isInternalChange===true)
event.internal=true;return event;}
function emit(emitter,sublistLine,fieldId,type)
{emitter.emit(getEvent(sublistLine,fieldId,type));}
function updateField(emitter,sublistLine,fieldId,oldValue,newValue,isInternalChange)
{emitter.emit(addInternalFlag(addFieldValues(getEvent(sublistLine,fieldId,EVENT_TYPE.FIELD_VALUE_CHANGE),oldValue,newValue),isInternalChange));}
return Object.freeze({Type:EVENT_TYPE,emit:emit,updateField:updateField});});define('N/record/modelEvent',['N/record/sublistLineEvent'],function(sublistLineEvent)
{var EVENT_TYPE=Object.freeze({FIELD_VALUE_CHANGE:'FIELD_VALUE_CHANGE',LINE_SELECT:'LINE_SELECT',LINE_CREATE:'LINE_CREATE',LINE_INSERT:'LINE_INSERT',LINE_UPDATE:'LINE_UPDATE',LINE_DELETE:'LINE_DELETE'});var EVENT_ORIGIN=Object.freeze({COPY:"COPY"});function getEvent(type,origin)
{var returnMe={type:type};if(origin!==undefined)
{returnMe.origin=origin;}
return returnMe;}
function addFieldId(event,fieldId)
{event.fieldId=fieldId;return event;}
function addFieldValues(event,oldValue,newValue)
{event.oldValue=oldValue;if(newValue!==undefined)
{event.newValue=newValue;}
return event;}
function addSublistInfo(event,sublistLine,isBuffer,suppressEmit)
{event.sublistId=sublistLine.id;event.lineId=sublistLine.getFieldValue('_id');event.line=sublistLine.index;event.useLineBuffer=!!isBuffer;if(!!suppressEmit)
event.suppressEmit=true;return event;}
function addInternalFlag(event,isInternalChange)
{if(isInternalChange===true)
event.internal=true;return event;}
function emit(emitter,fieldId,type)
{emitter.emit(addFieldId(getEvent(type),fieldId));}
function updateField(emitter,fieldId,oldValue,newValue,isInternalChange)
{emitter.emit(addInternalFlag(addFieldValues(addFieldId(getEvent(EVENT_TYPE.FIELD_VALUE_CHANGE),fieldId),oldValue,newValue),isInternalChange));}
function selectLine(emitter,sublistLine,isBuffer)
{emitter.emit(addSublistInfo(getEvent(EVENT_TYPE.LINE_SELECT),sublistLine,isBuffer));}
function createLine(emitter,sublistLine,isBuffer,origin)
{emitter.emit(addSublistInfo(getEvent(EVENT_TYPE.LINE_CREATE,origin),sublistLine,isBuffer));}
function insertLine(emitter,sublistLine,isBuffer)
{emitter.emit(addSublistInfo(getEvent(EVENT_TYPE.LINE_INSERT),sublistLine,isBuffer));}
function updateLine(emitter,sublistLine,isBuffer)
{emitter.emit(addSublistInfo(getEvent(EVENT_TYPE.LINE_UPDATE),sublistLine,isBuffer));}
function deleteLine(emitter,sublistLine,isBuffer,suppressEmit)
{emitter.emit(addSublistInfo(getEvent(EVENT_TYPE.LINE_DELETE),sublistLine,isBuffer,suppressEmit));}
var translateSublistLineEventTypeToModelEventType=(function(){var eventTranslations={};eventTranslations[sublistLineEvent.Type.FIELD_VALUE_CHANGE]=EVENT_TYPE.FIELD_VALUE_CHANGE;return function(sublistStateEventType){return eventTranslations[sublistStateEventType];}}());function addSublistLineEventDetails(event,sublistLineEvent,isBuffer)
{event.sublistId=sublistLineEvent.sublistLine.id;event.lineId=sublistLineEvent.sublistLine.getFieldValue('_id');event.line=sublistLineEvent.sublistLine.index;event.fieldId=sublistLineEvent.fieldId;if(sublistLineEvent.oldValue!==undefined){event.oldValue=sublistLineEvent.oldValue;}
if(sublistLineEvent.newValue!==undefined){event.newValue=sublistLineEvent.newValue;}
event.useLineBuffer=isBuffer;if(sublistLineEvent.internal){event.internal=true;}
return event;}
function translateSublistLineEventToModelEvent(sublistLineEvent,isBuffer)
{return addSublistLineEventDetails(getEvent(translateSublistLineEventTypeToModelEventType(sublistLineEvent.type)),sublistLineEvent,isBuffer);}
function forwardSublistLineEvent(emitter,isBuffer,sublistStateEvent)
{emitter.emit(translateSublistLineEventToModelEvent(sublistStateEvent,isBuffer));}
function forwardSublistLineEvents(emitter,sublistLine,isBuffer)
{var forward=forwardSublistLineEvent.bind(null,emitter,isBuffer);sublistLine.on({types:[sublistLineEvent.Type.FIELD_VALUE_CHANGE],listener:forward});}
function unforwardSublistLineEvents(sublistLine)
{sublistLine.off({types:[sublistLineEvent.Type.FIELD_VALUE_CHANGE]});}
return Object.freeze({Type:EVENT_TYPE,Origin:EVENT_ORIGIN,emit:emit,updateField:updateField,selectLine:selectLine,createLine:createLine,insertLine:insertLine,updateLine:updateLine,deleteLine:deleteLine,forwardSublistLineEvents:forwardSublistLineEvents,unforwardSublistLineEvents:unforwardSublistLineEvents});});define('N/common/record/recordDefinitionEventCompressor',['N/record/recordEvent'],function(recordEvent){function isErrorEvent(event)
{return event.error!==undefined;}
function getSingletonEvent(eventType,eventData)
{var event=eventData.singleton[eventType];event=!!event&&event.last;return event||null;}
function getBodyFieldEvent(fieldId,eventData,eventType)
{var event=eventData.body[eventType];event=!!event&&event[fieldId];event=!!event&&event.last;return event||null;}
function getBodyFieldErrorEvent(fieldId,eventData,eventType)
{var event=eventData.body[eventType];event=!!event&&event[fieldId];event=!!event&&event.error;return event||null;}
function getSublistFieldEvent(sublistId,fieldId,lineId,buffer,eventData,eventType)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[lineId];event=!!event&&event[eventType];event=!!event&&event[fieldId];event=!!event&&event.last;return event||null;}
function getSublistFieldErrorEvent(sublistId,fieldId,lineId,buffer,eventData,eventType)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[lineId];event=!!event&&event[eventType];event=!!event&&event[fieldId];event=!!event&&event.error;return event||null;}
function getSublistEvent(eventType,sublistId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[eventType];event=!!event&&event.last;return event||null;}
function getSublistErrorEvent(eventType,sublistId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[eventType];event=!!event&&event.error;return event||null;}
function getSublistLineEvent(eventType,sublistId,lineId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[lineId];event=!!event&&event[eventType];event=!!event&&event.last;return event||null;}
function getSublistLineErrorEvent(eventType,sublistId,lineId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var event=eventData.sublist[bufferOrActual][sublistId];event=!!event&&event[lineId];event=!!event&&event[eventType];event=!!event&&event.error;return event||null;}
function getUpdateAllEvent(eventData)
{return getSingletonEvent(recordEvent.Type.UPDATE_ALL,eventData);}
function getCreateLineEvent(sublistId,lineId,buffer,eventData)
{return getSublistLineEvent(recordEvent.Type.CREATE_LINE,sublistId,lineId,buffer,eventData);}
function getUpdateLineEvent(sublistId,lineId,buffer,eventData)
{return getSublistLineEvent(recordEvent.Type.UPDATE_LINE,sublistId,lineId,buffer,eventData);}
function getInsertLineEvent(sublistId,lineId,buffer,eventData)
{return getSublistLineEvent(recordEvent.Type.INSERT_LINE,sublistId,lineId,buffer,eventData);}
function getRemoveLineEvent(sublistId,lineId,buffer,eventData)
{return getSublistLineEvent(recordEvent.Type.REMOVE_LINE,sublistId,lineId,buffer,eventData);}
function hasErrorEvent(event,eventData)
{var hasEvent=false;for(var i=0;i<eventData.errors.length;i+=1)
{if(event.error!==undefined&&event.error===eventData.errors[i].error)
{hasEvent=true;break;}}
return hasEvent;}
function hasSingletonEvent(event,eventData)
{return event===getSingletonEvent(event.type,eventData);}
function hasFieldEvent(event,eventData)
{var result=false;if(!!event.sublistId)
{var func=isErrorEvent(event)?getSublistFieldErrorEvent:getSublistFieldEvent;result=event===func(event.sublistId,event.fieldId,event.lineId,event.useLineBuffer,eventData,event.type);}
else
{var func=isErrorEvent(event)?getBodyFieldErrorEvent:getBodyFieldEvent;result=event===func(event.fieldId,eventData,event.type);}
return result;}
function hasSublistEvent(event,eventData)
{var func=isErrorEvent(event)?getSublistErrorEvent:getSublistEvent;return event===func(event.type,event.sublistId,event.useLineBuffer,eventData);}
function hasSublistLineEvent(event,eventData)
{var func=isErrorEvent(event)?getSublistLineErrorEvent:getSublistLineEvent;return event===func(event.type,event.sublistId,event.lineId,event.useLineBuffer,eventData);}
function getSublistEventDataSafe(sublistId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var data=eventData.sublist[bufferOrActual];data[sublistId]=data[sublistId]||{};return data[sublistId];}
function getSublistLineEventDataSafe(sublistId,lineId,buffer,eventData)
{var bufferOrActual=buffer?'buffer':'actual';var data=eventData.sublist[bufferOrActual];data[sublistId]=data[sublistId]||{};data=data[sublistId];data[lineId]=data[lineId]||{};return data[lineId];}
function processErrorEvent(event,eventData)
{if(!hasErrorEvent(event,eventData))
{eventData.errors.push(event);}}
function processSingletonEvent(event,eventData)
{var data=eventData.singleton;data[event.type]=data[event.type]||{first:null,last:null,error:null};data=data[event.type];updateFirstLastEvent(event,data);}
function processUpdateAllEvent(event,eventData)
{eventData.body={};eventData.sublist={actual:{},buffer:{}};eventData.singleton={};eventData.errors=[];processSingletonEvent(event,eventData);}
function updateSublistEvent(event,data)
{data[event.type]=data[event.type]||{first:null,last:null,error:null};data=data[event.type];updateFirstLastEvent(event,data);}
function processSublistEvent(event,eventData)
{if(isErrorEvent(event))
{processErrorEvent(event,eventData);}
var data=getSublistEventDataSafe(event.sublistId,event.useLineBuffer,eventData);var updateAll=!!getUpdateAllEvent(eventData);if(!updateAll)
{updateSublistEvent(event,data);}}
function updateSublistLineEvent(event,data)
{data[event.type]=data[event.type]||{first:null,last:null,error:null};data=data[event.type];updateFirstLastEvent(event,data);}
function processSublistLineEvent(event,eventData)
{if(isErrorEvent(event))
{processErrorEvent(event,eventData);}
var data=getSublistLineEventDataSafe(event.sublistId,event.lineId,event.useLineBuffer,eventData);var updateAll=!!getUpdateAllEvent(eventData);if(!updateAll&&!getRemoveLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData)||isErrorEvent(event))
{updateSublistLineEvent(event,data);}}
function processSublistRemoveLineEvent(event,eventData)
{var isError=isErrorEvent(event);if(isError)
{processErrorEvent(event,eventData);}
var data=getSublistLineEventDataSafe(event.sublistId,event.lineId,event.useLineBuffer,eventData);var updateAll=!!getUpdateAllEvent(eventData);var lineCreatedOrInserted=(getCreateLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData)||getInsertLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData));if(!isError)
{Object.keys(data).forEach(function(v){delete data[v];});}
if(!updateAll&&!lineCreatedOrInserted||isError)
{updateSublistLineEvent(event,data);}}
function updateFirstLastEvent(event,data)
{var isError=isErrorEvent(event);var firstEvent=data.first==null;var eventGoesToOriginalState=!firstEvent&&data.first.oldValue!==undefined&&event.newValue!==undefined&&data.first.oldValue===event.newValue;if(isError)
{data.error=event;}
else if(firstEvent)
{data.first=event;data.last=event;}
else if(eventGoesToOriginalState)
{data.first=null;data.last=null;}
else
{data.last=event;if(data.first.hasOwnProperty('oldValue'))
{data.last.oldValue=data.first.oldValue;}}}
function updateFieldEvent(event,data)
{data[event.type]=data[event.type]||{};data=data[event.type];data[event.fieldId]=data[event.fieldId]||{first:null,last:null,error:null};data=data[event.fieldId];updateFirstLastEvent(event,data);}
function processFieldBodyEvent(event,eventData)
{var data=eventData.body;var updateAll=!!getUpdateAllEvent(eventData);if(!updateAll)
{updateFieldEvent(event,data);}}
function processFieldSublistEvent(event,eventData)
{var updateAll=!!getUpdateAllEvent(eventData);var ignore=!isErrorEvent(event)&&(getCreateLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData)||getUpdateLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData)||getInsertLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData)||getRemoveLineEvent(event.sublistId,event.lineId,event.useLineBuffer,eventData));if(ignore&&ignore.type!==recordEvent.Type.REMOVE_LINE&&isFieldStatus(event)){ignore=false;}
if(!updateAll&&!ignore||isErrorEvent(event))
{var data=getSublistLineEventDataSafe(event.sublistId,event.lineId,event.useLineBuffer,eventData);updateFieldEvent(event,data);}}
function isFieldStatus(event){return(event.type==recordEvent.Type.FIELD_IS_MANDATORY_CHANGE||event.type==recordEvent.Type.FIELD_IS_HIDDEN_CHANGE||event.type==recordEvent.Type.FIELD_IS_DISABLED_CHANGE||event.type==recordEvent.Type.FIELD_IS_VISIBLE_CHANGE||event.type==recordEvent.Type.FIELD_IS_DISPLAY_CHANGE||event.type==recordEvent.Type.FIELD_IS_READ_ONLY_CHANGE||event.type==recordEvent.Type.FIELD_LABEL_CHANGE);}
function processFieldEvent(event,eventData)
{if(isErrorEvent(event))
{processErrorEvent(event,eventData);}
if(!!event.sublistId)
{processFieldSublistEvent(event,eventData)}
else
{processFieldBodyEvent(event,eventData);}}
var processEvent=(function(){var process={};process[recordEvent.Type.ERROR]=processErrorEvent;process[recordEvent.Type.UPDATE_ALL]=processUpdateAllEvent;process[recordEvent.Type.RECORD_INITIALIZED]=processSingletonEvent;process[recordEvent.Type.UPDATE_FIELD_OPTIONS]=processFieldEvent;process[recordEvent.Type.UPDATE_FIELD_VALUE]=processFieldEvent;process[recordEvent.Type.CREATE_LINE]=processSublistLineEvent;process[recordEvent.Type.UPDATE_LINE]=processSublistLineEvent;process[recordEvent.Type.INSERT_LINE]=processSublistLineEvent;process[recordEvent.Type.REMOVE_LINE]=processSublistRemoveLineEvent;process[recordEvent.Type.SELECT_LINE]=processSublistEvent;process[recordEvent.Type.FIELD_IS_MANDATORY_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_IS_HIDDEN_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_IS_DISABLED_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_IS_VISIBLE_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_IS_DISPLAY_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_IS_READ_ONLY_CHANGE]=processFieldEvent;process[recordEvent.Type.FIELD_LABEL_CHANGE]=processFieldEvent;process[recordEvent.Type.SUBLIST_IS_DISPLAY_CHANGE]=processSublistEvent;process[recordEvent.Type.SUBLIST_IS_HIDDEN_CHANGE]=processSublistEvent;process[recordEvent.Type.SUBLIST_COLUMN_LABEL_CHANGE]=processSublistEvent;process[recordEvent.Type.VALIDATION_FAILED]=processSublistLineEvent;return function processEvent(event,eventData){var func=process[event.type]||function(){};func(event,eventData);};}());var hasEvent=(function(){var has={};has[recordEvent.Type.ERROR]=hasErrorEvent;has[recordEvent.Type.UPDATE_ALL]=hasSingletonEvent;has[recordEvent.Type.RECORD_INITIALIZED]=hasSingletonEvent;has[recordEvent.Type.UPDATE_FIELD_OPTIONS]=hasFieldEvent;has[recordEvent.Type.UPDATE_FIELD_VALUE]=hasFieldEvent;has[recordEvent.Type.CREATE_LINE]=hasSublistLineEvent;has[recordEvent.Type.UPDATE_LINE]=hasSublistLineEvent;has[recordEvent.Type.INSERT_LINE]=hasSublistLineEvent;has[recordEvent.Type.REMOVE_LINE]=hasSublistLineEvent;has[recordEvent.Type.SELECT_LINE]=hasSublistEvent;has[recordEvent.Type.FIELD_IS_MANDATORY_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_IS_HIDDEN_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_IS_DISABLED_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_IS_VISIBLE_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_IS_DISPLAY_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_IS_READ_ONLY_CHANGE]=hasFieldEvent;has[recordEvent.Type.FIELD_LABEL_CHANGE]=hasFieldEvent;has[recordEvent.Type.SUBLIST_IS_DISPLAY_CHANGE]=hasSublistEvent;has[recordEvent.Type.SUBLIST_IS_HIDDEN_CHANGE]=hasSublistEvent;has[recordEvent.Type.SUBLIST_COLUMN_LABEL_CHANGE]=hasSublistEvent;has[recordEvent.Type.VALIDATION_FAILED]=hasSublistLineEvent;return function hasEvent(event,eventData){var func=has[event.type]||function(){return false;};return func(event,eventData);};}());function createEventData(events)
{var eventData={body:{},sublist:{actual:{},buffer:{}},singleton:{},errors:[]};events.forEach(function(event){processEvent(event,eventData);});return{hasEvent:function(event){return hasEvent(event,eventData);}}}
function cleanEvent(event)
{delete event.oldValue;delete event.newValue;return event;}
function BatchInsertModeHandler()
{var isBatchInserting=false;function isEventThisType(thisEvent,thisType)
{return!!thisEvent&&(thisEvent.type===thisType);}
function getLastFilteredEvent(filteredList)
{return filteredList.slice(filteredList.length-1)[0];}
function updateBatchInsertionStatus(thisEvent,eventList)
{var lastEvent=getLastFilteredEvent(eventList);var isLastInsert=isEventThisType(lastEvent,recordEvent.Type.INSERT_LINE);var isThisInsert=isEventThisType(thisEvent,recordEvent.Type.INSERT_LINE);isBatchInserting=isLastInsert&&isThisInsert;}
this.update=updateBatchInsertionStatus;function shouldIgnoreEvent(thisEvent,eventList)
{if(!isBatchInserting||eventList.length===0)
return false;var lastEvent=getLastFilteredEvent(eventList);var isCreateEvent=isEventThisType(thisEvent,recordEvent.Type.CREATE_LINE);var doLineIdsMatch=thisEvent.lineId===lastEvent.lineId;return isBatchInserting&&isCreateEvent&&doLineIdsMatch;}
this.shouldIgnore=shouldIgnoreEvent;}
function compress(events)
{var eventData=createEventData(events);var batchInsertModeChecker=new BatchInsertModeHandler();var filteredEvents=events.reduce(function(p,c,i,a){if(eventData.hasEvent(c)&&!batchInsertModeChecker.shouldIgnore(c,p))
{batchInsertModeChecker.update(c,p);p.push(cleanEvent(c));}
return p;},[]);return filteredEvents;}
function noCompress(events)
{return events.map(function(v,i,a){return cleanEvent(v);});}
return Object.freeze({compress:compress,noCompress:noCompress});});define('N/common/record/recordDefinitionEvent',['N/record/recordEvent','N/record/modelEvent','N/record/recordStateControllerEvent','N/record/metadataEvent','N/record/recordFieldEvent','N/common/record/recordDefinitionEventCompressor'],function(recordEvent,modelEvent,recordStateControllerEvent,metadataEvent,recordFieldEvent,recordDefinitionEventCompressor){var EVENT_TYPE=recordEvent.Type;function getEvent(type,record,useInteractiveMode)
{return{type:type,record:record.proxy({isInteractive:useInteractiveMode})}}
function addErrorAttribute(obj,error)
{obj.error=error;return obj;}
function wrapEmitError(options)
{var record=options.record;var func=options.func;var emitter=options.emitter;return function(){var result=undefined;try
{result=func.apply(record,arguments);}
catch(error)
{emitError(emitter,record,error);throw error;}
return result;}}
function addSublistLineAttributes_MLB(event,sublistId,line,lineInstanceId)
{if(!!sublistId)
{var isCommitted=false;event.sublistId=sublistId;event.lineId=lineInstanceId;event.line=line;event.useLineBuffer=!isCommitted;}
return event;}
function addSublistLineAttributes(event,sublistId,line)
{if(!sublistId)
return event;var onCurrentLine=line===-1||line===event.record.getCurrentSublistIndex(sublistId);event.sublistId=sublistId;event.line=line;if(onCurrentLine)
{event.lineId=event.record.getCurrentSublistValue({sublistId:sublistId,fieldId:'_id'});}
else
{if(event.record.getCurrentSublistIndex(sublistId)===-1)
return event;event.lineId=event.record.getSublistValue({sublistId:sublistId,fieldId:'_id',line:line});}
event.useLineBuffer=onCurrentLine;return event;}
function getLineValidationEvent(record,sublistId,line,fields)
{var event=addFieldAttributes(getEvent(EVENT_TYPE.VALIDATION_FAILED,record),fields,sublistId,line);return event;}
function wrapEmitValidationError(options)
{var record=options.record;var func=options.func;var emitter=options.emitter;var sublistId=options.sublistId;var line=sublistId!=null?record.getCurrentSublistIndex(sublistId):undefined;var fields=options.fieldId?[{id:options.fieldId}]:[];return function(){var result=undefined;try
{result=func.apply(record,arguments);}
catch(error)
{var messages;if(error.hasOwnProperty('validationDetail'))
{if(error.validationDetail.hasOwnProperty('fields'))
fields=error.validationDetail.fields;messages=error.validationDetail.messages;}
var event=addErrorAttribute(getLineValidationEvent(record,sublistId,line,fields),error);emitter.emit(event);var errorCopy=Object.create(error);if(error.userFacing!==undefined&&error.userFacing!==null){errorCopy.userFacing=error.userFacing;}
errorCopy.validationDetail={};var inputs=[['messages',messages],['fields',fields],['sublistId',sublistId],['line',line],['lineId',event.lineId]];inputs.forEach(function(v){if(v[1]!=null)errorCopy.validationDetail[v[0]]=v[1];});throw errorCopy;}
return result;}}
function emitError(emitter,record,error)
{emitter.emit(addErrorAttribute(getEvent(EVENT_TYPE.ERROR,record),error));}
function emitUpdateAll(emitter,record)
{emitter.emit(getEvent(EVENT_TYPE.UPDATE_ALL,record));}
function addFieldAttributes_MLB(event,fieldId,sublistId,line,lineInstanceId)
{var onSublist=!!sublistId;var singleMode=!Array.isArray(fieldId);if(onSublist)
event=addSublistLineAttributes_MLB(event,sublistId,line,lineInstanceId);event.fieldId=singleMode?fieldId:fieldId[0]&&fieldId[0].id;if(singleMode)
event.field=getField_MLB(fieldId,lineInstanceId);else
event.fields=fieldId.map(function(v){var res=util.extend({},v);res.field=getField_MLB(v.id,lineInstanceId);return res;});function getField_MLB(fieldId,lineInstanceId)
{if(!onSublist)
return event.record.getField({fieldId:fieldId});else
return event.record.getLine({sublistId:sublistId,lineInstanceId:lineInstanceId,isCommitted:false}).getField({fieldId:fieldId});}
return event;}
function addFieldAttributes(event,fieldId,sublistId,line)
{var onSublist=!!sublistId;var onCurrentLine=onSublist&&(line===-1||line===event.record.getCurrentSublistIndex(sublistId));var singleMode=!Array.isArray(fieldId);var canGetField=!onSublist||onCurrentLine||event.record.getCurrentSublistIndex(sublistId)!==-1;if(onSublist)
event=addSublistLineAttributes(event,sublistId,line);event.fieldId=singleMode?fieldId:fieldId[0]&&fieldId[0].id;if(singleMode&&canGetField)
event.field=getField(fieldId);if(!singleMode)
event.fields=fieldId.map(function(v){var res=util.extend({},v);if(canGetField)res.field=getField(v.id);return res;});function getField(fieldId)
{if(!onSublist)
return event.record.getField({fieldId:fieldId});else if(onCurrentLine)
return event.record.getCurrentSublistField({sublistId:sublistId,fieldId:fieldId});else
return event.record.getSublistField({sublistId:sublistId,fieldId:fieldId,line:line});}
return event;}
function addActionAttributes(event,action,data)
{if(action)
{event.action=action;event.data=data;}
return event;}
function emitUpdateFieldOptions(emitter,record,sublistId,fieldId,line,action,data,isMultilineEditable,lineInstanceId)
{var event=getEvent(EVENT_TYPE.UPDATE_FIELD_OPTIONS,record,isMultilineEditable);if(!!isMultilineEditable)
{event=addFieldAttributes_MLB(event,fieldId,sublistId,line,lineInstanceId);}
else
{event=addFieldAttributes(event,fieldId,sublistId,line);}
event=addActionAttributes(event,action,data);emitter.emit(event);}
var translateModelEventTypeToRecordEventType=(function(){var eventTranslations={};eventTranslations[modelEvent.Type.FIELD_VALUE_CHANGE]=EVENT_TYPE.UPDATE_FIELD_VALUE;eventTranslations[modelEvent.Type.LINE_SELECT]=EVENT_TYPE.SELECT_LINE;eventTranslations[modelEvent.Type.LINE_CREATE]=EVENT_TYPE.CREATE_LINE;eventTranslations[modelEvent.Type.LINE_INSERT]=EVENT_TYPE.INSERT_LINE;eventTranslations[modelEvent.Type.LINE_UPDATE]=EVENT_TYPE.UPDATE_LINE;eventTranslations[modelEvent.Type.LINE_DELETE]=EVENT_TYPE.REMOVE_LINE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function addModelEventDetails(event,modelEvent)
{var onSublist=modelEvent.hasOwnProperty('sublistId');var onField=modelEvent.hasOwnProperty('fieldId');if(onSublist)
{event.sublistId=modelEvent.sublistId;event.lineId=modelEvent.lineId;event.line=modelEvent.line;event.useLineBuffer=modelEvent.useLineBuffer;if(modelEvent.hasOwnProperty("suppressEmit"))
event.suppressEmit=modelEvent.suppressEmit;if(modelEvent.hasOwnProperty("origin"))
event.origin=modelEvent.origin;}
if(onField){event.fieldId=modelEvent.fieldId;if(modelEvent.oldValue!==undefined){event.oldValue=modelEvent.oldValue;}
if(modelEvent.newValue!==undefined){event.newValue=modelEvent.newValue;}}
if(modelEvent.internal)
event.internal=true;return event;}
function translateModelEventToRecordEvent(modelEvent,record)
{return addModelEventDetails(getEvent(translateModelEventTypeToRecordEventType(modelEvent.type),record),modelEvent);}
function forwardModelControllerEvent(record,emitter,modelEvent)
{emitter.emit(translateModelEventToRecordEvent(modelEvent,record));}
function forwardModelControllerEvents(options)
{var record=options.record;var emitter=options.emitter;var forward=forwardModelControllerEvent.bind(null,record,emitter);record.getModelController().on({types:[modelEvent.Type.FIELD_VALUE_CHANGE,modelEvent.Type.LINE_SELECT,modelEvent.Type.LINE_CREATE,modelEvent.Type.LINE_INSERT,modelEvent.Type.LINE_UPDATE,modelEvent.Type.LINE_DELETE],listener:forward});}
var translateRecordStateEventTypeToRecordEventType=(function(){var eventTranslations={};eventTranslations[recordStateControllerEvent.Type.FIELD_IS_MANDATORY_CHANGE]=EVENT_TYPE.FIELD_IS_MANDATORY_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_IS_HIDDEN_CHANGE]=EVENT_TYPE.FIELD_IS_HIDDEN_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_IS_DISABLED_CHANGE]=EVENT_TYPE.FIELD_IS_DISABLED_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_IS_VISIBLE_CHANGE]=EVENT_TYPE.FIELD_IS_VISIBLE_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_IS_DISPLAY_CHANGE]=EVENT_TYPE.FIELD_IS_DISPLAY_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_IS_READ_ONLY_CHANGE]=EVENT_TYPE.FIELD_IS_READ_ONLY_CHANGE;eventTranslations[recordStateControllerEvent.Type.FIELD_LABEL_CHANGE]=EVENT_TYPE.FIELD_LABEL_CHANGE;eventTranslations[recordStateControllerEvent.Type.SUBLIST_IS_DISPLAY_CHANGE]=EVENT_TYPE.SUBLIST_IS_DISPLAY_CHANGE;eventTranslations[recordStateControllerEvent.Type.SUBLIST_IS_HIDDEN_CHANGE]=EVENT_TYPE.SUBLIST_IS_HIDDEN_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function addRecordStateEventFieldDetails(event,recordStateEvent)
{var onSublist=recordStateEvent.hasOwnProperty('sublistId');var onCurrentLine=onSublist&&!!recordStateEvent.currentLine;if(onSublist)
{event.sublistId=recordStateEvent.sublistId;if(onCurrentLine)
{event.lineId=event.record.getCurrentSublistValue({sublistId:recordStateEvent.sublistId,fieldId:'_id'});event.line=recordStateEvent.line;event.field=event.record.getCurrentSublistField({sublistId:recordStateEvent.sublistId,fieldId:recordStateEvent.fieldId});}
else
{event.lineId=event.record.getSublistValue({sublistId:recordStateEvent.sublistId,fieldId:'_id',line:recordStateEvent.line});event.line=recordStateEvent.line;event.field=event.record.getSublistField({sublistId:recordStateEvent.sublistId,fieldId:recordStateEvent.fieldId,line:recordStateEvent.line});}
event.useLineBuffer=onCurrentLine;}
else
{event.field=event.record.getField({fieldId:recordStateEvent.fieldId});}
event.fieldId=recordStateEvent.fieldId;if(recordStateEvent.oldValue!==undefined){event.oldValue=recordStateEvent.oldValue;}
if(recordStateEvent.newValue!==undefined){event.newValue=recordStateEvent.newValue;}
return event;}
function addRecordStateEventSublistDetails(event,recordStateEvent)
{event.sublistId=recordStateEvent.sublistId;event.sublist=event.record.getSublist({sublistId:recordStateEvent.sublistId});if(recordStateEvent.oldValue!==undefined){event.oldValue=recordStateEvent.oldValue;}
if(recordStateEvent.newValue!==undefined){event.newValue=recordStateEvent.newValue;}
return event;}
function addRecordStateEventDetails(event,recordStateEvent)
{function isRecordStateFieldEvent(type)
{return[recordStateControllerEvent.Type.FIELD_IS_MANDATORY_CHANGE,recordStateControllerEvent.Type.FIELD_IS_HIDDEN_CHANGE,recordStateControllerEvent.Type.FIELD_IS_DISABLED_CHANGE,recordStateControllerEvent.Type.FIELD_IS_VISIBLE_CHANGE,recordStateControllerEvent.Type.FIELD_IS_DISPLAY_CHANGE,recordStateControllerEvent.Type.FIELD_IS_READ_ONLY_CHANGE,recordStateControllerEvent.Type.FIELD_LABEL_CHANGE].indexOf(type)!==-1;}
function isRecordStateSublistEvent(type)
{return[recordStateControllerEvent.Type.SUBLIST_IS_DISPLAY_CHANGE,recordStateControllerEvent.Type.SUBLIST_IS_HIDDEN_CHANGE].indexOf(type)!==-1;}
if(isRecordStateFieldEvent(recordStateEvent.type))
{addRecordStateEventFieldDetails(event,recordStateEvent);}
else if(isRecordStateSublistEvent(recordStateEvent.type))
{addRecordStateEventSublistDetails(event,recordStateEvent);}
return event;}
function translateRecordStateEventToRecordEvent(recordStateEvent,record)
{record.flushBufferCacheForFieldStateUpdate(recordStateEvent.sublistId,recordStateEvent.fieldId,recordStateEvent.line,recordStateEvent.currentLine);return addRecordStateEventDetails(getEvent(translateRecordStateEventTypeToRecordEventType(recordStateEvent.type),record),recordStateEvent);}
function forwardRecordStateEvent(emitter,record,recordStateEvent)
{emitter.emit(translateRecordStateEventToRecordEvent(recordStateEvent,record));}
function forwardRecordStateEvents(emitter,record)
{var recordStateController=record.getRecordStateController();var forward=forwardRecordStateEvent.bind(null,emitter,record);recordStateController.on({types:[recordStateControllerEvent.Type.FIELD_IS_MANDATORY_CHANGE,recordStateControllerEvent.Type.FIELD_IS_HIDDEN_CHANGE,recordStateControllerEvent.Type.FIELD_IS_DISABLED_CHANGE,recordStateControllerEvent.Type.FIELD_IS_VISIBLE_CHANGE,recordStateControllerEvent.Type.FIELD_IS_DISPLAY_CHANGE,recordStateControllerEvent.Type.FIELD_IS_READ_ONLY_CHANGE,recordStateControllerEvent.Type.FIELD_LABEL_CHANGE,recordStateControllerEvent.Type.SUBLIST_IS_DISPLAY_CHANGE,recordStateControllerEvent.Type.SUBLIST_IS_HIDDEN_CHANGE],listener:forward});}
var translateMetadataEventTypeToRecordEventType=(function(){var eventTranslations={};eventTranslations[metadataEvent.Type.FIELD_METADATA_LABEL_CHANGE]=EVENT_TYPE.SUBLIST_COLUMN_LABEL_CHANGE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function addMetadataEventDetails(event,metadataEvent)
{event.sublistId=metadataEvent.sublistId;event.fieldId=metadataEvent.fieldId;if(metadataEvent.oldValue!==undefined){event.oldValue=metadataEvent.oldValue;}
if(metadataEvent.newValue!==undefined){event.newValue=metadataEvent.newValue;}
return event;}
function translateMetadataEventToRecordEvent(metadataEvent,record)
{return addMetadataEventDetails(getEvent(translateMetadataEventTypeToRecordEventType(metadataEvent.type),record),metadataEvent);}
function forwardMetadataEvent(emitter,record,metadataEvent)
{emitter.emit(translateMetadataEventToRecordEvent(metadataEvent,record));}
function forwardMetadataEvents(emitter,record)
{var metadata=record.getMetadata();var forward=forwardMetadataEvent.bind(null,emitter,record);metadata.on({types:[metadataEvent.Type.FIELD_METADATA_LABEL_CHANGE],listener:forward});}
var translateRecordFieldEventTypeToRecordEventType=(function(){var eventTranslations={};eventTranslations[recordFieldEvent.Type.FIELD_VALUE_CHANGE]=EVENT_TYPE.UPDATE_FIELD_VALUE;return function(fieldStateEventType){return eventTranslations[fieldStateEventType];}}());function addRecordFieldEventDetails(event,recordFieldEvent,onCurrentLine)
{var onSublist=recordFieldEvent.recordField.getSublistName()!==null;if(onSublist)
{var sublistId=recordFieldEvent.recordField.getSublistName();var lineNum=recordFieldEvent.recordField.getLine();event.sublistId=sublistId;if(onCurrentLine)
{event.lineId=event.record.getCurrentSublistValue({sublistId:sublistId,fieldId:'_id'});event.line=lineNum;}
else
{event.lineId=event.record.getSublistValue({sublistId:sublistId,fieldId:'_id',line:lineNum});event.line=lineNum;}
event.useLineBuffer=onCurrentLine;}
event.fieldId=recordFieldEvent.recordField.getName();if(recordFieldEvent.hasOwnProperty('error'))
{event.error=recordFieldEvent.error;}
return event;}
function onCurrentLine(recordFieldEvent,record)
{var result=false;var sublistId=recordFieldEvent.recordField.getSublistName();var fieldId=recordFieldEvent.recordField.getName();var onSublist=sublistId!==null;if(onSublist)
{result=record.getCurrentCachedRecordField(sublistId,fieldId)===recordFieldEvent.recordField;}
return result;}
function translateRecordFieldEventToRecordEvent(recordFieldEvent,record)
{return addRecordFieldEventDetails(getEvent(translateRecordFieldEventTypeToRecordEventType(recordFieldEvent.type),record),recordFieldEvent,onCurrentLine(recordFieldEvent,record));}
function forwardRecordFieldEvent(emitter,record,recordFieldEvent)
{emitter.emit(translateRecordFieldEventToRecordEvent(recordFieldEvent,record));}
function forwardRecordFieldEvents(emitter,record,recordField)
{var forward=forwardRecordFieldEvent.bind(null,emitter,record);recordField.on({types:[recordFieldEvent.Type.FIELD_VALUE_CHANGE],listener:forward});}
return Object.freeze({Type:EVENT_TYPE,emitError:emitError,emitUpdateAll:emitUpdateAll,emitUpdateFieldOptions:emitUpdateFieldOptions,forwardModelControllerEvents:forwardModelControllerEvents,forwardRecordStateEvents:forwardRecordStateEvents,forwardMetadataEvents:forwardMetadataEvents,forwardRecordFieldEvents:forwardRecordFieldEvents,wrapEmitError:wrapEmitError,wrapEmitValidationError:wrapEmitValidationError,eventCompress:recordDefinitionEventCompressor.compress,eventNoCompress:recordDefinitionEventCompressor.noCompress});});define('N/common/record/line/lineDefinition',['N/record/line/lineProxy','N/utilityFunctions','N/error','N/common/record/recordActualWork','N/record/line/sublistLineImplementation','N/eventEmitter','N/common/record/recordDefinitionEvent'],function(lineProxy,utilityFunctions,error,recordBehaviorDelegateService,sublistLineImplementation,eventEmitter,recordDefinitionEvent)
{function Line(options)
{var that=this;var exposedLineProxy;var lineConstructorOptions=options;var lineInstanceId,sublistId,useBuffer,isReadOnly;var unproxiedRecord;var isInited=false;var recordBehaviorDelegate=recordBehaviorDelegateService.create({delegate:this});var implementation;lineInstanceId=options.lineInstanceId;sublistId=options.sublistId;useBuffer=options.fromBuffer;unproxiedRecord=options.unproxiedRecord;isReadOnly=!!options.isReadOnly;implementation=sublistLineImplementation.create({useBuffer:useBuffer,line:this});(function processOptions(options)
{var isRecordDynamic=!!unproxiedRecord.isDynamic||false;var isLineReadOnly=options.isReadOnly||false;exposedLineProxy=(function()
{var proxyCache=null;return function()
{if(!proxyCache)
{var wrappedLine=lineProxy.wrap({delegate:that,isDynamic:isRecordDynamic,isReadOnly:isLineReadOnly});proxyCache=wrappedLine;}
return proxyCache;}.bind(null,that);}());}(lineConstructorOptions));unproxiedRecord.on({types:[recordDefinitionEvent.Type.ERROR,recordDefinitionEvent.Type.UPDATE_FIELD_VALUE,recordDefinitionEvent.Type.UPDATE_FIELD_OPTIONS,recordDefinitionEvent.Type.CREATE_LINE,recordDefinitionEvent.Type.UPDATE_LINE,recordDefinitionEvent.Type.INSERT_LINE,recordDefinitionEvent.Type.REMOVE_LINE,recordDefinitionEvent.Type.SELECT_LINE,recordDefinitionEvent.Type.FIELD_IS_MANDATORY_CHANGE,recordDefinitionEvent.Type.FIELD_IS_HIDDEN_CHANGE,recordDefinitionEvent.Type.FIELD_IS_DISABLED_CHANGE,recordDefinitionEvent.Type.FIELD_IS_VISIBLE_CHANGE,recordDefinitionEvent.Type.FIELD_IS_DISPLAY_CHANGE,recordDefinitionEvent.Type.FIELD_IS_READ_ONLY_CHANGE,recordDefinitionEvent.Type.FIELD_LABEL_CHANGE,recordDefinitionEvent.Type.VALIDATION_FAILED],listener:function(event)
{if(event.sublistId===sublistId&&event.lineId===lineInstanceId&&event.useLineBuffer===useBuffer)
{emitter.emit(event);}}});var emitter=eventEmitter.create({eventTypes:Object.keys(recordDefinitionEvent.Type).map(function(v){return recordDefinitionEvent.Type[v];}),async:typeof setTimeout==='function',insulated:true});function getHack()
{return getUnproxiedRecord();}
this.getHack=getHack;function getExposedLineProxy(){return exposedLineProxy;}
this.getExposedLineProxy=getExposedLineProxy;utilityFunctions.addReadOnlyProperty(this,'proxy',getExposedLineProxy);function getLineInstanceId(){return lineInstanceId;}
this.getLineInstanceId=getLineInstanceId;utilityFunctions.addReadOnlyProperty(this,'instanceId',getLineInstanceId);function getSublistId(){return sublistId;}
this.getSublistId=getSublistId;utilityFunctions.addReadOnlyProperty(this,'sublistId',getSublistId);function getSequence(){return unproxiedRecord.getModelController().getSublistLineValueForInstance(sublistId,'_sequence',lineInstanceId,useBuffer);}
this.getSequence=getSequence;utilityFunctions.addReadOnlyProperty(this,'sequence',getSequence);function getRecord(){return unproxiedRecord;}
this.getRecord=getRecord;utilityFunctions.addReadOnlyProperty(this,'record',getRecord);function getUnproxiedRecord(){return unproxiedRecord;}
this.getUnproxiedRecord=getUnproxiedRecord;function validateTextApi(isTextApi,fieldState,methodName,suggestedMethod)
{getUnproxiedRecord().validateTextApi(isTextApi,fieldState,methodName,suggestedMethod);}
this.validateTextApi=validateTextApi;function getFieldLevelMetadataForBodyField(fieldId)
{return getUnproxiedRecord().getFieldLevelMetadataForSublistField(getSublistId(),fieldId);}
this.getFieldLevelMetadataForBodyField=getFieldLevelMetadataForBodyField;function isValidBodyField(fieldId)
{return getUnproxiedRecord().isValidSublistField(getSublistId(),fieldId);}
this.isValidBodyField=isValidBodyField;function getFieldState(fieldId)
{return implementation.getFieldState(fieldId)}
this.getFieldState=getFieldState;function parseValue(isValidField,fieldLevelMetadata,value)
{return getUnproxiedRecord().parseValue(isValidField,fieldLevelMetadata,value);}
this.parseValue=parseValue;function setParsedValueAndUpdateFieldState(fieldId,value,fieldState)
{implementation.setParsedValueForBodyField(fieldId,value,fieldState);fieldState.isParsed=true;}
this.setParsedValueAndUpdateFieldState=setParsedValueAndUpdateFieldState;function getSetFieldMetadata(sublistId,fieldId)
{var fieldLevelMetadata=getFieldLevelMetadataForBodyField(fieldId);return{isValidField:isValidBodyField(fieldId),isMultiSelect:!!fieldLevelMetadata?fieldLevelMetadata.isTypeMultiSelect:false,isSelect:!!fieldLevelMetadata?fieldLevelMetadata.isTypeSelect:false,isRadio:!!fieldLevelMetadata?fieldLevelMetadata.isTypeRadio:false,isNumeric:!!fieldLevelMetadata?fieldLevelMetadata.isNumeric:false,isCurrency:!!fieldLevelMetadata?fieldLevelMetadata.isCurrency:false,type:!!fieldLevelMetadata?fieldLevelMetadata.type:null};}
this.getSetFieldMetadata=getSetFieldMetadata;function extractInforFromFieldLevelMetadata(sublistId,fieldId)
{var fieldLevelMetadata=getFieldLevelMetadataForBodyField(fieldId);return{fieldId:fieldId,sublistId:getSublistId(),radioSet:!!fieldLevelMetadata?fieldLevelMetadata.radioSet:false,hasBlankString:!!fieldLevelMetadata?fieldLevelMetadata.hasBlankString:false,blankString:!!fieldLevelMetadata?fieldLevelMetadata.blankString:undefined,supplementedOptions:!!fieldLevelMetadata?fieldLevelMetadata.supplementedOptions:undefined}}
this.extractInforFromFieldLevelMetadata=extractInforFromFieldLevelMetadata;function cancel()
{recordBehaviorDelegate.cancel();return exposedLineProxy();}
this.cancel=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:cancel,emitter:emitter});function commit()
{recordBehaviorDelegate.commit();return exposedLineProxy();}
this.commit=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:commit,emitter:emitter});function commitPromise()
{return new Promise(function(resolve,reject)
{try
{recordBehaviorDelegate.commit();resolve(exposedLineProxy());}
catch(e)
{reject(e);}});}
this.commit.promise=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:commitPromise,emitter:emitter});function getFields()
{return recordBehaviorDelegate.getFields();}
this.getFields=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:getFields,emitter:emitter});function getField(options)
{return recordBehaviorDelegate.getField(options);}
this.getField=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:getField,emitter:emitter});function hasSubrecord(options)
{return recordBehaviorDelegate.hasSubrecord(options);}
this.hasSubrecord=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:hasSubrecord,emitter:emitter});function getSubrecord(options)
{var subrecord=recordBehaviorDelegate.getSubrecord(options);return subrecord;}
this.getSubrecord=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:getSubrecord,emitter:emitter});function removeSubrecord(options)
{recordBehaviorDelegate.removeSubrecord(options);return exposedLineProxy();}
this.removeSubrecord=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:removeSubrecord,emitter:emitter});function getValue(options)
{return recordBehaviorDelegate.getValue(options);}
this.getValue=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:getValue,emitter:emitter});function doGetValue(fieldId)
{return implementation.doGetValue(fieldId);}
this.doGetValue=doGetValue;function getParsedValueForBodyField(fieldId,delegator)
{var delegator=delegator||recordBehaviorDelegate;return implementation.getParsedValueForBodyField(fieldId,delegator);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function setValue(options)
{recordBehaviorDelegate.setValue(options);return exposedLineProxy();}
this.setValue=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:setValue,emitter:emitter});function doSetValue(fieldId,value,fireFieldChange,delegator)
{return implementation.doSetValue(fieldId,value,fireFieldChange,delegator);}
this.doSetValue=doSetValue;function getText(options)
{return recordBehaviorDelegate.getText(options);}
this.getText=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:getText,emitter:emitter});function doGetText(fieldId,delegator)
{delegator=delegator||recordBehaviorDelegate;return implementation.doGetText(fieldId,delegator);}
this.doGetText=doGetText;function setText(options)
{recordBehaviorDelegate.setText(options);return exposedLineProxy();}
this.setText=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:setText,emitter:emitter});function doSetText(fieldId,text,fireFieldChange,delegator)
{return implementation.doSetText(fieldId,text,fireFieldChange,delegator);}
this.doSetText=doSetText;function doGetField(fieldId,delegator)
{delegator=delegator||recordBehaviorDelegate;return implementation.doGetField(fieldId,delegator);}
this.doGetField=doGetField;function doGetFields()
{return implementation.doGetFields();}
this.doGetFields=doGetFields;function doCommit()
{return implementation.doCommit();}
this.doCommit=doCommit;function doCancel()
{return implementation.doCancel();}
this.doCancel=doCancel;function doHasSubrecord(fieldId)
{return implementation.hasSubrecord(fieldId);}
this.doHasSubrecord=doHasSubrecord;function doGetSubrecord(fieldId)
{return implementation.getSubrecord(fieldId);}
this.doGetSubrecord=doGetSubrecord;function doRemoveSubrecord(fieldId)
{return implementation.removeSubrecord(fieldId)}
this.doRemoveSubrecord=doRemoveSubrecord;function makeCopy()
{return recordBehaviorDelegate.makeCopy()}
this.makeCopy=recordDefinitionEvent.wrapEmitError({record:unproxiedRecord,func:makeCopy,emitter:emitter});function doMakeCopy()
{return implementation.makeCopy()}
this.doMakeCopy=doMakeCopy;function on(options)
{var types=options.types,listener=options.listener;utilityFunctions.checkArgs([types,listener],['types','listener'],getMissingArgumentErrorMessageFillerValue('on'));emitter.on({types:types,listener:listener});return exposedLineProxy();}
this.on=on;function off(options)
{var types=options.types,listener=options.listener;utilityFunctions.checkArgs([types,listener],['types','listener'],getMissingArgumentErrorMessageFillerValue('off'));emitter.off({types:types,listener:listener});return exposedLineProxy();}
this.off=off;function toJSON()
{return{lineInstanceId:that.instanceId,sublistId:that.sublistId,fields:unproxiedRecord.getModelController().getSublistLineJSON(that.sublistId,that.instanceId,useBuffer)}}
this.toJSON=toJSON;function toString()
{return "line.Line";}
this.toString=toString;function setIsInited(){isInited=true;}
function getIsInited(){return isInited;}
function getMissingArgumentErrorMessageFillerValue(methodName)
{return exposedLineProxy().toString()+'.'+methodName;}
this.getMissingArgumentErrorMessageFillerValue=getMissingArgumentErrorMessageFillerValue;utilityFunctions.checkArgs([lineInstanceId,sublistId,unproxiedRecord],['lineInstanceId','sublistId','unproxiedRecord'],getMissingArgumentErrorMessageFillerValue("Line() constructor"));setIsInited();return that;}
return Line;});define('N/util/slaving',['N/utilityFunctions','N/record/recordUtilityFunctions'],function(utilityFunctions,recordUtilityFunctions){slavingUtil=function()
{var MULTISELECT="multiselect";var SlavingMetadataKey={QUERY_URL:"queryurl",EDIT:"edit",DISPLAY_ONLY:"displayonly",AUX_FIELDS:"auxfields",MULTILINE:"ln",MASTER:"master",FIELD_OBJECT:{NAME:"name",MACHINE:"machine",HTML_REF:"htmlReference",REQUIRED:"required",REQUIRED_SCRIPT:"requiredScript",IS_REQUIRED:"isRequired"}};var QueryRequst={URL:"url",PAYLOAD:"payload"};var SlaveResultKey={NAME:'name',MACHINE_NAME:'machine',FIRE_FIELDCHANGE:'firechange',IS_CLIENT_SLAVING:'isClientSlaving',OPTIONS:'options',VALUE:'value',TEXT:'text',NO_OVERRIDE:'nooverride',CONDITION:'condition'};function RemoteRecordDelegate(recordDelegate)
{var record=recordDelegate.currentRecord;var utilFunctionsFromRecordInstance=recordDelegate.util;function getFieldOptionIndexById(options,id)
{for(var i=0;i<options.length;i++)
{if(options[i].id==id)
return i;}
return-1;}
function getFieldOptions(){return utilFunctionsFromRecordInstance.getFieldOptions();}
function setFieldNoSlaving(fieldInfo,noslaving)
{utilFunctionsFromRecordInstance.setFieldNoSlaving(fieldInfo.machineName,fieldInfo.fieldName,fieldInfo.lineNum,noslaving);}
function isMultilineEditable(machineName)
{return utilFunctionsFromRecordInstance.isMultilineEditable(machineName);}
function getValue(params)
{var value="";if(params.isMachineField===true)
{if(!!params.lineInstanceId)
{var useBuffer=true;value=record.getSublistLineValueAsLegacyStringForInstance(params.machineName,params.fieldName,params.lineInstanceId,useBuffer);}
else if(params.ln&&params.ln!==-1)
{value=record.getSublistLineValueAsLegacyString(params.machineName,params.fieldName,params.ln);value=value===null||value===undefined?"":value;}
else
{value=record.getCurrentSublistLineValueAsLegacyString(params.machineName,params.fieldName);}}
else if(params.isMultiSelectField)
value=record.getValueAsLegacyStringArray(params.fieldName);else
value=record.getValueAsLegacyString(params.fieldName);return recordUtilityFunctions.emptyIfNullOrUndefined(value);}
function setValue(params,value,fireFieldChange,isClientSlaving)
{var noslaving=isClientSlaving?false:true;if(params.isMachineField===true)
record.doSetCurrentSublistFieldValue(params.machineName,params.fieldName,value,fireFieldChange,noslaving,true,true);else if(params.isMultiSelectField)
record.doSetFieldValue(params.fieldName,value,fireFieldChange,noslaving,true,true);else
record.doSetFieldValue(params.fieldName,value,fireFieldChange,noslaving,true,true);}
function setSelectValue(params,value,text,fireFieldChange)
{if(!value&&value!=='')
{if(params.isMachineField===true)
record.doSetCurrentSublistText(params.machineName,params.fieldName,text,fireFieldChange,true,true);else
record.doSetText(params.fieldName,value,fireFieldChange,true,true);}
else
setValue(params,value,fireFieldChange);}
function getFieldOptionFromCache(params)
{if(getFieldOptions()!==null&&!(getFieldOptions().get(params.machineName,params.fieldName,params.lineNum)))
putFieldOptionInCache(params,[]);return getFieldOptions().get(params.machineName,params.fieldName,params.lineNum);}
function putFieldOptionInCache(params,obj)
{getFieldOptions().put(params.machineName,params.fieldName,params.lineNum,obj);}
function removeOption(params,value)
{var options=getFieldOptionFromCache(params);if(options.length>0)
{if(value||value===0)
{var idx=getFieldOptionIndexById(options,value);options.splice(idx,1);}
else
{options.splice(0,options.length);}
putFieldOptionInCache(params,options);}}
function insertOption(params,value,text)
{var options=getFieldOptionFromCache(params);if(options&&options instanceof Array)
{options.push({text:text,id:value});putFieldOptionInCache(params,options);}}
this.setFieldNoSlaving=setFieldNoSlaving;this.isMultilineEditable=isMultilineEditable;this.getValue=getValue;this.setValue=setValue;this.setSelectValue=setSelectValue;this.removeOption=removeOption;this.insertOption=insertOption;this.isEditableSublist=utilFunctionsFromRecordInstance.isEditableSublist;this.isFieldMultiSelect=utilFunctionsFromRecordInstance.isFieldMultiSelect;this.returnEmptyIfNull=utilityFunctions.returnEmptyIfNull;this.isValEmpty=utilityFunctions.isValEmpty;this.getCurrentLineItemIndex=function(sublist){return record.getCurrentSublistIndex({sublistId:sublist});};this.triggerPostSourcing=utilFunctionsFromRecordInstance.postSourcing;this.eval=record.runLegacyScript;}
function BrowserRecordDelegate()
{function setFieldNoSlaving(fieldInfo,noslaving)
{var field=getFieldObject(fieldInfo);if(field)
field.noslaving=noslaving;}
function getFieldObject(params)
{if(params.isMachineField===true)
return nlapiGetLineItemField(params.machineName,params.fieldName,params.lineNum);else
return nlapiGetField(params.fieldName);}
function getValue(params)
{var value="";if(params.isMachineField===true)
{if(!!params.lineInstanceId)
{var useBuffer=true;value=record.getSublistLineValueAsLegacyStringForInstance(params.machineName,params.fieldName,params.lineInstanceId,useBuffer);}
else if(params.ln)
value=utilityFunctions.returnEmptyIfNull(nlapiGetLineItemValue(params.machineName,params.fieldName,params.ln));else
value=nlapiGetCurrentLineItemValue(params.machineName,params.fieldName);}
else if(params.isMultiSelectField)
value=nlapiGetFieldValues(params.fieldName);else
value=nlapiGetFieldValue(params.fieldName);return value;}
function setValue(params,value,fireFieldChange)
{if(params.isMachineField===true)
nlapiSetCurrentLineItemValue(params.machineName,params.fieldName,value,fireFieldChange,true);else if(params.isMultiSelectField)
nlapiSetFieldValues(params.fieldName,value,fireFieldChange,true);else
nlapiSetFieldValue(params.fieldName,value,fireFieldChange,true);}
function setSelectValue(params,value,text,fireFieldChange)
{if(params.isMachineField===true)
nlapiSetCurrentLineItemSelectValue(params.machineName,params.fieldName,value,text,fireFieldChange,getSlavingAsync());else
nlapiSetSelectValue(params.fieldName,text,fireFieldChange,getSlavingAsync());}
function insertSelectOption(fieldName,value,text)
{var form=typeof(ftabs)!='undefined'&&ftabs[getFieldName(fieldName)]!=null?document.forms[ftabs[getFieldName(fieldName)]+'_form']:document.forms[0];doInsertSelectOption(form,fieldName,text,value);}
function insertLineItemOption(machineName,fieldName,value,text)
{var form=document.forms[machineName+'_form'];doInsertSelectOption(form,fieldName,text,value);}
function doInsertSelectOption(form,fieldName,text,value)
{var fld=getFormElement(form,getFieldName(fieldName));if(fld!=null)
addSelectOption(document,fld,text,value);}
function removeSelectOption(fieldName,value)
{var form=typeof(ftabs)!='undefined'&&ftabs[getFieldName(fieldName)]!=null?document.forms[ftabs[getFieldName(fieldName)]+'_form']:document.forms[0];doRemoveSelectOption(form,fieldName,value);}
function removeLineItemOption(machineName,fieldName,value)
{var form=document.forms[machineName+'_form'];doRemoveSelectOption(form,fieldName,value);}
function doRemoveSelectOption(form,fieldName,value)
{var fld=getFormElement(form,getFieldName(fieldName));if(fld!=null)
{if(value!=null)
deleteOneSelectOption(fld,value);else
deleteAllSelectOptions(fld,window);}}
function removeOption(params,value)
{if(params.isMachineField===true)
removeLineItemOption(params.machineName,params.fieldName,value);else
removeSelectOption(params.fieldName,value)}
function insertOption(params,value,text)
{if(params.isMachineField===true)
insertLineItemOption(params.machineName,params.fieldName,value,text);else
insertSelectOption(params.fieldName,value,text)}
function isFieldMultiSelect(sublistId,fieldId,line)
{var field=getFieldObject({isMachineField:!!sublistId,machineName:sublistId,fieldName:fieldId,lineNum:line});return field?field.getType()===MULTISELECT:false;}
this.setFieldNoSlaving=setFieldNoSlaving;this.getValue=getValue;this.setValue=setValue;this.setSelectValue=setSelectValue;this.removeOption=removeOption;this.insertOption=insertOption;this.isEditableSublist=isEditMachine;this.isFieldMultiSelect=isFieldMultiSelect;this.serverCall=nsServerCall;this.returnEmptyIfNull=emptyIfNull;this.isValEmpty=isValEmpty;this.getCurrentLineItemIndex=nlapiGetCurrentLineItemIndex;this.eval=eval;}
function getQueryRequest(metadata,masterInfo,recordDelegate)
{var IS_EDIT='e';var RECORD_ID='id';var QUERY_PARAMETER_NAME='q';var QUERY_PARAMETER_VALUE='si';var MACHINE_NAME='machine';var QUERYREQUEST_SLAVING_FIELD='f';var LIST_MACHINE_LINE_NUMBER='ln';var RecordDelegate=(recordDelegate)?new RemoteRecordDelegate(recordDelegate):new BrowserRecordDelegate();var isBrowserRequest=(recordDelegate)?false:true;var lineNum=masterInfo.hasOwnProperty('lineNum')&&masterInfo.lineNum!=null?masterInfo.lineNum:null;var lineInstanceId=masterInfo.hasOwnProperty('lineInstanceId')&&masterInfo.lineInstanceId!=null?masterInfo.lineInstanceId:null;var sublistName=masterInfo.sublistName;var result=cleanupQueryURL(metadata[SlavingMetadataKey.QUERY_URL]);var url=result[QueryRequst.URL];var payload=result[QueryRequst.PAYLOAD];if(metadata[SlavingMetadataKey.EDIT]==='T')
{var id=(recordDelegate?recordDelegate.currentRecord.id:RecordDelegate.getValue({fieldName:'id'}));if(id||id===0)
payload[RECORD_ID]=String(id);if(metadata[SlavingMetadataKey.DISPLAY_ONLY]!=='T')
payload[IS_EDIT]='T';}
payload[QUERY_PARAMETER_NAME]=masterInfo['queryFieldName'];payload[QUERY_PARAMETER_VALUE]=masterInfo['queryFieldValue'];if(sublistName)
payload[MACHINE_NAME]=sublistName;if(masterInfo['fieldspec'].length!=0)
payload[QUERYREQUEST_SLAVING_FIELD]=masterInfo['fieldspec'];if(metadata[SlavingMetadataKey.MULTILINE]==='T'&&lineNum>0)
payload[LIST_MACHINE_LINE_NUMBER]=String(lineNum);var valid=addAuxFieldValueToPayloadAndReturnFalseWhenInvalid(isBrowserRequest,metadata,lineNum,lineInstanceId,payload,RecordDelegate);if(!valid)
return null;addMasterValueToPayload(metadata,lineNum,payload,RecordDelegate);return{url:url,payload:payload};}
function addAuxFieldValueToPayloadAndReturnFalseWhenInvalid(isBrowserRequest,metadata,lineNum,lineInstanceId,payload,RecordDelegate)
{var auxfields=metadata[SlavingMetadataKey.AUX_FIELDS];for(var idx=0;auxfields&&idx<auxfields.length;idx++)
{var auxfld=auxfields[idx];var fieldName=auxfld.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.NAME)?auxfld[SlavingMetadataKey.FIELD_OBJECT.NAME]:"";var machineName=auxfld.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.MACHINE)?auxfld[SlavingMetadataKey.FIELD_OBJECT.MACHINE]:null;var htmlReference=auxfld.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.HTML_REF)?auxfld[SlavingMetadataKey.FIELD_OBJECT.HTML_REF]:null;var fieldValue=RecordDelegate.getValue({isMachineField:machineName!==null,machineName:machineName,fieldName:fieldName,ln:lineNum,lineInstanceId:lineInstanceId});if(isBrowserRequest&&!fieldValue&&fieldValue!==0&&fieldValue!=="")
fieldValue=eval(htmlReference);if(auxfld[SlavingMetadataKey.FIELD_OBJECT.REQUIRED]==='T'&&isInvalidRequiredAuxField(isBrowserRequest,auxfld,fieldValue))
return false;payload['si_'+fieldName]=fieldValue;}
return true;}
function addMasterValueToPayload(metadata,lineNum,payload,RecordDelegate)
{if(metadata[SlavingMetadataKey.MASTER]&&metadata[SlavingMetadataKey.MASTER]!=='')
{var fld=metadata[SlavingMetadataKey.MASTER];var masterFieldName=fld[SlavingMetadataKey.FIELD_OBJECT.NAME];var machineName=fld.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.MACHINE)?fld[SlavingMetadataKey.FIELD_OBJECT.MACHINE]:null;payload['si_'+masterFieldName]=RecordDelegate.getValue({isMachineField:machineName!==null,machineName:machineName,fieldName:masterFieldName,ln:lineNum});}}
function cleanupQueryURL(url)
{var payload={};if(url.indexOf("?")!==-1)
{var list=url.split("?");url=list[0];if(list[1].length>0)
{var params=list[1].split("&");for(var i=0;i<params.length;i++)
{if(params[i].length>0)
{var pair=params[i].split("=");payload[pair[0]]=String(pair[1]);}}}}
return{url:url,payload:payload};}
function isInvalidRequiredAuxField(isBrowserRequest,field,value)
{var requiredScriptCondition=true;if(isBrowserRequest&&field.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.REQUIRED_SCRIPT))
requiredScriptCondition=(eval(field[SlavingMetadataKey.FIELD_OBJECT.REQUIRED_SCRIPT]))?true:false;else if(field.hasOwnProperty(SlavingMetadataKey.FIELD_OBJECT.IS_REQUIRED)&&field.isRequired)
requiredScriptCondition=true;var isValidValue=(value&&value.length!=0)?true:false;return requiredScriptCondition&&!isValidValue;}
function getURL(metadata,masterInfo)
{var requestObj=getQueryRequest(metadata,masterInfo,undefined);var fullUrl=requestObj['url'];var payload=requestObj['payload'];if(fullUrl.indexOf('?')==-1)
{fullUrl+='?';}
var first=true;for(var key in payload)
{if(!first)
fullUrl+='&';else
first=false;if(key.indexOf('si_')===0||key==='q'||key==='si'||key==='id')
fullUrl=fullUrl+key+'='+encodeURIComponent(emptyIfNull(payload[key]));else
fullUrl=fullUrl+key+'='+emptyIfNull(payload[key]);}
return fullUrl;}
function addEscaping(value)
{value=value.replace(/\\/g,"\\\\");value=value.replace(/'/g,"\\\'");value=value.replace(/"/g,"\\\"");return value;}
function verifySlavingValues(fields,slavingValues)
{try{for(var j=0;fields&&j<fields.length;j++)
{for(var idx=0;slavingValues&&idx<slavingValues.length;idx++)
{var slaveInfo=slavingValues[idx];if(isFunction(slaveInfo))
{continue;}
if(slaveInfo['name']!=fields[j][0]||(slaveInfo['machine']!=null&&slaveInfo['machine']!=fields[j][1]||slaveInfo['machine']==null&&fields[j][1]!=""))
continue;var options=slaveInfo["options"];var fld=nlapiGetLineItemField(slaveInfo["machine"],slaveInfo["name"]);if(slaveInfo["machine"]!=null)
{if(options!=null)
{var legacyValues=getLineItemOptionValues(slaveInfo["machine"],slaveInfo["name"],fld.type);var legacyTexts=getLineItemOptionTexts(slaveInfo["machine"],slaveInfo["name"],fld.type);if(legacyValues.length!=options.length)
nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Length mismatch','Options length do not match. Field name:'+slaveInfo['name']+' ,path = '+window.location.pathname]);else
{for(var i=0;options&&i<options.length;i++)
{var option=options[i];var legacyValue=addEscaping(legacyValues[i]);var legacyText=addEscaping(legacyTexts[i]);legacyText=legacyText.replace('\n','');if(option[0]!=legacyValue)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Value mismatch','Options slaving value do not match. Field name:'+slaveInfo['name']+' jsonValue ='+option[0]+' legacyValue = '+legacyValues[i]+' ,path = '+window.location.pathname]);break;}
if(option[1]!=legacyText)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Value mismatch','Options slaving text do not match. Field name:'+slaveInfo['name']+' jsonValue ='+option[1]+' legacyValue = '+legacyTexts[i]+' ,path = '+window.location.pathname]);break;}}}}
if(slaveInfo["nooverride"]!=null)
{continue;}
if(slaveInfo["condition"]!=null)
if(!eval(slaveInfo["condition"]))
continue;var oldvalue=nlapiGetCurrentLineItemValue(slaveInfo["machine"],slaveInfo["name"]);oldvalue=addEscaping(oldvalue);if(slaveInfo["value"]!=null&&slaveInfo["value"]!=oldvalue)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json Value mismatch','Value slaving result do not match. Field name:'+slaveInfo['name']+', jsonText = '+slaveInfo["value"]+', actualValue  = '+oldvalue+' ,path = '+window.location.pathname]);}
if(slaveInfo["text"]!=null)
{var oldtext=nlapiGetCurrentLineItemText(slaveInfo["machine"],slaveInfo["name"]);oldtext=addEscaping(oldtext);if(slaveInfo["text"]!=oldtext)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json Value mismatch','Value slaving result do not match. Field name:'+slaveInfo['name']+', jsonText = '+slaveInfo['text']+', actualValue  = '+oldtext+' ,path = '+window.location.pathname]);}}}
else
{var oldvalue=nlapiGetFieldValue(slaveInfo["name"]);oldvalue=addEscaping(oldvalue);var options=slaveInfo["options"];var fld=nlapiGetField(slaveInfo["name"]);if(options!=null)
{var legacyValues=getOptionValues(slaveInfo["name"],fld.type);var legacyTexts=getOptionTexts(slaveInfo["name"],fld.type);if(legacyValues.length!=options.length)
nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Length mismatch','Options length do not match. Field name:'+slaveInfo['name']+' ,path = '+window.location.pathname]);else
{for(var i=0;options&&i<options.length;i++)
{var option=options[i];var legacyValue=addEscaping(legacyValues[i]);var legacyText=addEscaping(legacyTexts[i]);legacyText=legacyText.replace('\n','');if(option[0]!=legacyValue)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Value mismatch','Options slaving value do not match. Field name:'+slaveInfo['name']+' jsonValue ='+option[0]+' legacyValue = '+legacyValues[i]+' ,path = '+window.location.pathname]);break;}
if(option[1]!=legacyText)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json option Value mismatch','Options slaving text do not match. Field name:'+slaveInfo['name']+' jsonValue ='+option[1]+' legacyValue = '+legacyText[i]+' ,path = '+window.location.pathname]);break;}}}}
if(slaveInfo["nooverride"]!=null)
{continue;}
if(slaveInfo["condition"]!=null)
if(!eval(slaveInfo["condition"]))
continue;if(slaveInfo["value"]!=null&&slaveInfo["value"]!=oldvalue)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json Value mismatch','Value slaving result do not match. Field name:'+slaveInfo['name']+', jsonText = '+slaveInfo['value']+', actualValue  = '+oldvalue+' ,path = '+
window.location.pathname]);}
if(slaveInfo["text"]!=null)
{var oldtext=nlapiGetFieldText(slaveInfo["name"]);oldtext=addEscaping(oldtext);;if(slaveInfo["text"]!=oldtext)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Json Value mismatch','Value slaving result do not match. Field name:'+slaveInfo['name']+', jsonText = '+slaveInfo['text']+', actualValue  = '+oldtext+' ,path = '+
window.location.pathname]);}}}}}}
catch(err)
{nsServerCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Excepion in verifying values',err.msg+' ,path = '+window.location.pathname]);}}
function isFunction(obj)
{return Object.prototype.toString.call(obj)==='[object Function]';}
function processSlavingValues(slavingValues,record)
{var RecordDelegate=(record)?new RemoteRecordDelegate(record):new BrowserRecordDelegate();for(var idx=0;slavingValues&&idx<slavingValues.length;idx++)
{var slaveResult=slavingValues[idx];var fieldName=slaveResult[SlaveResultKey.NAME];var isMachineField=slaveResult.hasOwnProperty(SlaveResultKey.MACHINE_NAME);var machineName=(isMachineField)?slaveResult[SlaveResultKey.MACHINE_NAME]:null;var lineNum=(isMachineField)?RecordDelegate.getCurrentLineItemIndex(machineName):-1;var fieldInfo={isMachineField:isMachineField,machineName:machineName,fieldName:fieldName,lineNum:lineNum};fieldInfo.isMultiSelectField=RecordDelegate.isFieldMultiSelect(machineName,fieldName,lineNum);if(isFunction(slaveResult))
{slaveResult(RecordDelegate);continue;}
if(isMachineField&&lineNum===-1&&RecordDelegate.isMultilineEditable(machineName))
{if(!!console&&!!console.warn)
console.warn("Slaving was called on a Multiline Editable Sublist, but there is no current index available! Slaving IGNORED");continue;}
try
{applySlaveValueToRecord(RecordDelegate,slaveResult,fieldInfo);}
catch(err)
{if(RecordDelegate instanceof BrowserRecordDelegate)
RecordDelegate.serverCall('/app/common/scripting/nlapijsonhandler.nl','logSlavingError',['Excepion in processing values',err.msg+',path =  '+((record)?"":window.location.pathname)]);else
throw err;}
finally
{if(record==null)
RecordDelegate.setFieldNoSlaving(fieldInfo,false);}}}
function applySlaveValueToRecord(RecordDelegate,slaveResult,fieldInfo)
{var fireFieldChangeEvent=slaveResult.hasOwnProperty(SlaveResultKey.FIRE_FIELDCHANGE);var isClientSlaving=slaveResult.hasOwnProperty(SlaveResultKey.IS_CLIENT_SLAVING);RecordDelegate.setFieldNoSlaving(fieldInfo,!fireFieldChangeEvent);var options=slaveResult[SlaveResultKey.OPTIONS];if(options)
{var oldValue=RecordDelegate.getValue(fieldInfo);var isOldValueInOptions=false;RecordDelegate.removeOption(fieldInfo);for(var j=0;j<options.length;j++)
{var option=options[j];RecordDelegate.insertOption(fieldInfo,option[0],option[1]);if(oldValue===option[0])
isOldValueInOptions=true;}
var preserveOriginalValueWhenOptionSlavingOnly=(RecordDelegate.isValEmpty(slaveResult[SlaveResultKey.VALUE])&&!RecordDelegate.isValEmpty(oldValue)&&isOldValueInOptions);if(preserveOriginalValueWhenOptionSlavingOnly)
RecordDelegate.setValue(fieldInfo,oldValue,false);}
if(slaveResult[SlaveResultKey.NO_OVERRIDE]!=null&&!RecordDelegate.isValEmpty(RecordDelegate.getValue(fieldInfo)))
return;var slavingCondition=typeof slaveResult[SlaveResultKey.CONDITION]==='boolean'?slaveResult[SlaveResultKey.CONDITION]:RecordDelegate.eval(slaveResult[SlaveResultKey.CONDITION]);if(slaveResult.hasOwnProperty(SlaveResultKey.CONDITION)&&!slavingCondition)
return;if(slaveResult.hasOwnProperty(SlaveResultKey.TEXT))
RecordDelegate.setSelectValue(fieldInfo,slaveResult[SlaveResultKey.VALUE],slaveResult[SlaveResultKey.TEXT],fireFieldChangeEvent,isClientSlaving);else if(slaveResult.hasOwnProperty(SlaveResultKey.VALUE))
RecordDelegate.setValue(fieldInfo,slaveResult[SlaveResultKey.VALUE],fireFieldChangeEvent,isClientSlaving);}
function redrawEditMachines(machinedata)
{for(var machineName in machinedata)
{var slaveMachineData=machinedata[machineName];if(slaveMachineData['edit']!=null&&(slaveMachineData["nooverride"]==null||document.forms[0].elements['next'+machineName+'idx'].value==1))
{var data=slaveMachineData['data'];var strValue='';for(var i=0;data&&i<data.length;i++)
{var row=data[i];for(var j=0;row&&j<row.length;j++)
{if(strValue!='')
strValue+=String.fromCharCode(1);strValue+=row[j];}
if(i!=data.length-1)
strValue+=String.fromCharCode(2);}
document.forms[0].elements[machineName+'data'].value=strValue;clearLineArray(name);document.forms[0].elements['next'+machineName+'idx'].value=data==null?1:data.length+1;document.forms[0].elements[machineName+'valid'].value='T';setMachineContentUpdated(machineName,true);clearLineArray(name);if(parent.document.forms.main_form.elements[machineName+'loaded']!=null)parent.document.forms.main_form.elements[machineName+'loaded'].value='T';if(parent.document.forms.main_form.elements[machineName+'dotted']!=null)parent.document.forms.main_form.elements[machineName+'dotted'].value='T';if(window[machineName+'_machine']!=null)
{window[machineName+'_machine'].refresheditmachine(true);window[machineName+'_machine'].recalc();}
var tabTD=parent.document.getElementById(machineName+'lnkdot');if(tabTD!=null){tabTD.style.display='';}}
if(isFunction(slaveMachineData['metadata']))
{slaveMachineData['metadata'].call();continue;}}}
function getOptionValues(fldnam,type)
{var form=typeof(ftabs)!='undefined'&&ftabs[getFieldName(fldnam)]!=null?document.forms[ftabs[getFieldName(fldnam)]+'_form']:document.forms[0];var fld=getFormElement(form,getFieldName(fldnam));if(fld!=null)
if(type===MULTISELECT)
return getMultiDropdown(fld,window).getValues();else
return getDropdown(fld,window).getValues();else
return null;}
function getOptionTexts(fldnam,type)
{var form=typeof(ftabs)!='undefined'&&ftabs[getFieldName(fldnam)]!=null?document.forms[ftabs[getFieldName(fldnam)]+'_form']:document.forms[0];var fld=getFormElement(form,getFieldName(fldnam));if(fld!=null)
if(type===MULTISELECT)
return getMultiDropdown(fld,window).textArray;else
return getDropdown(fld,window).getTexts();else
return null;}
function getLineItemOptionValues(machine,fldnam,type)
{var form=document.forms[machine+'_form'];var fld=getFormElement(form,getFieldName(fldnam));if(fld!=null)
if(type===MULTISELECT)
return getMultiDropdown(fld,window).getValues();else
return getDropdown(fld,window).getValues();else
return null;}
function getLineItemOptionTexts(machine,fldnam,type)
{var form=document.forms[machine+'_form'];var fld=getFormElement(form,getFieldName(fldnam));if(fld!=null)
if(type===MULTISELECT)
return getMultiDropdown(fld,window).textArray;else
return getDropdown(fld,window).getTexts();else
return null;}
return{cleanupQueryURL:cleanupQueryURL,getQueryRequest:getQueryRequest,getURL:getURL,processSlavingValues:processSlavingValues,verifySlavingValues:verifySlavingValues,redrawEditMachines:redrawEditMachines};}();if(typeof Object.freeze=='function')
slavingUtil=Object.freeze(slavingUtil);return slavingUtil;});define('N/record/proxy/readOnlyRecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/environment'],function(nsobject,constants,utilityFunctions,environment)
{function ReadOnlyRecord(delegate,isInteractive,isCurrentRecord)
{var proxyOptions=Object.freeze({isInteractive:isInteractive});this.getMacros=delegate.getMacros.bind(null,this);this.getMacro=delegate.getMacro.bind(null,this);this.executeMacro=delegate.executeMacro.bind(null,this);this.executeMacro.promise=delegate.executeMacro.promise.bind(null,this);utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return delegate.id;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return delegate.type;});utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.getMessageService=delegate.getMessageService;this.toJSON=delegate.toJSON;this.toString=function(){return constants.RECORD_MODE.READ_ONLY_RECORD;};if(isCurrentRecord)
this.toString=function(){return constants.CURRENT_RECORD_MODE.READ_ONLY_CURRENT_RECORD;};this.getActions=delegate.getActions;this.getAction=delegate.getAction;this.executeAction=delegate.executeAction;this.getFields=delegate.getFields;this.getSublist=delegate.getSublist;this.getSublists=delegate.getSublists;this.getSublistFields=delegate.getSublistFields;this.getValue=delegate.getValue;this.getText=delegate.getText;this.getField=delegate.getField;this.getSublistField=delegate.getSublistField;this.getLineCount=delegate.getLineCount;this.findSublistLineWithValue=delegate.findSublistLineWithValue;this.getSublistValue=delegate.getSublistValue;this.getSublistText=delegate.getSublistText;this.hasSubrecord=delegate.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=delegate.getSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.hasSublistSubrecord=delegate.hasSublistSubrecord;this.getSublistSubrecord=function getSublistSubrecord()
{var subrecord=delegate.getSublistSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.getMatrixHeaderValue=delegate.getMatrixHeaderValue;this.getMatrixSublistValue=delegate.getMatrixSublistValue;this.getMatrixHeaderField=delegate.getMatrixHeaderField;this.getMatrixSublistField=delegate.getMatrixSublistField;this.findMatrixSublistLineWithValue=delegate.findMatrixSublistLineWithValue;this.getMatrixHeaderCount=delegate.getMatrixHeaderCount;if(isCurrentRecord)
{if(delegate.toString()===constants.RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_RECORD)
{delete(this.toJSON);delete(this.getFields);delete(this.getSublists);delete(this.getSublistFields);}}
if(isInteractive)
{if(delegate.toString()===constants.RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_RECORD)
utilityFunctions.throwSuiteScriptError(error.Type.YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION);utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isReadOnly',function(){return true;});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'query',function getQuery(){return delegate.query;});this.getLine=delegate.getLine;this.getLines=function(options)
{util.extend(options,{isCommitted:true});return delegate.getLines(options);}
this.getLinesIterator=delegate.getLinesIterator;}
return this;}
ReadOnlyRecord.prototype=nsobject.getNewInstance();Object.freeze(ReadOnlyRecord);return ReadOnlyRecord;});define('N/record/proxy/deferredDynamicRecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/environment'],function(nsobject,constants,utilityFunctions,environment)
{function DeferredDynamicRecord(delegate,isInteractive,isCurrentRecord)
{var proxyOptions=Object.freeze({isInteractive:isInteractive});if(isCurrentRecord)
utilityFunctions.throwSuiteScriptError(error.Type.YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION);utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return delegate.id;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return delegate.type;});utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.getMessageService=delegate.getMessageService;this.save=delegate.save;this.toJSON=delegate.toJSON;this.toString=function(){return constants.RECORD_MODE.DEFERRED_DYNAMIC_RECORD;};this.removeField=function removeField()
{delegate.removeField.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getFields=delegate.getFields;this.getSublist=delegate.getSublist;this.getSublists=delegate.getSublists;this.getSublistFields=delegate.getSublistFields;this.getValue=delegate.getValue;this.setValue=function setValue()
{delegate.setValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getText=delegate.getText;this.setText=function setText()
{delegate.setText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getField=delegate.getField;this.getSublistField=delegate.getSublistField;this.getLineCount=delegate.getLineCount;this.insertLine=function insertLine()
{var line=delegate.insertLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.removeLine=function removeLine()
{delegate.removeLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.findSublistLineWithValue=delegate.findSublistLineWithValue;this.getSublistValue=delegate.getSublistValue;this.setSublistValue=function setSublistValue()
{delegate.setSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getSublistText=delegate.getSublistText;this.setSublistText=function setSublistText()
{delegate.setSublistText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.hasSubrecord=delegate.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=delegate.getSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeSubrecord=function removeSubrecord()
{delegate.removeSubrecord.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.hasSublistSubrecord=delegate.hasSublistSubrecord;this.getSublistSubrecord=function getSublistSubrecord()
{var subrecord=delegate.getSublistSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeSublistSubrecord=function removeSublistSubrecord()
{delegate.removeSublistSubrecord.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.setMatrixHeaderValue=function setMatrixHeaderValue()
{delegate.setMatrixHeaderValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getMatrixHeaderValue=delegate.getMatrixHeaderValue;this.setMatrixSublistValue=function setMatrixSublistValue()
{delegate.setMatrixSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getMatrixSublistValue=delegate.getMatrixSublistValue;this.getMatrixHeaderField=delegate.getMatrixHeaderField;this.getMatrixSublistField=delegate.getMatrixSublistField;this.findMatrixSublistLineWithValue=delegate.findMatrixSublistLineWithValue;this.getMatrixHeaderCount=delegate.getMatrixHeaderCount;if(delegate._addToTemplateRenderer)
this._addToTemplateRenderer=delegate._addToTemplateRenderer;if(isInteractive)
{utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'saveAndFetch',function getFunc_saveAndFetch(){return delegate.saveAndFetch;});this.getLine=delegate.getLine;this.getLines=delegate.getLines;this.getLinesIterator=delegate.getLinesIterator;}
return this;}
DeferredDynamicRecord.prototype=nsobject.getNewInstance();Object.freeze(DeferredDynamicRecord);return DeferredDynamicRecord;});define('N/record/proxy/dynamicRecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/environment'],function(nsobject,constants,utilityFunctions,environment)
{function DynamicRecord(delegate,isInteractive,isCurrentRecord)
{function augmentWithInteractive(args)
{return utilityFunctions.augmentArguments(args,"isInteractive",isInteractive)}
var proxyOptions=Object.freeze({isInteractive:isInteractive});this.getMacros=delegate.getMacros.bind(null,this);this.getMacro=delegate.getMacro.bind(null,this);this.executeMacro=delegate.executeMacro.bind(null,this);this.executeMacro.promise=delegate.executeMacro.promise.bind(null,this);utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return delegate.id;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return delegate.type;});utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.getMessageService=delegate.getMessageService;this.save=delegate.save;this.toJSON=delegate.toJSON;this.toString=function(){return constants.RECORD_MODE.DYNAMIC_RECORD;};if(isCurrentRecord)
this.toString=function(){return constants.CURRENT_RECORD_MODE.CURRENT_RECORD;};this.removeField=function removeField()
{delegate.removeField.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getFields=delegate.getFields;this.getSublist=delegate.getSublist;this.getSublists=delegate.getSublists;this.getSublistFields=delegate.getSublistFields;this.getValue=delegate.getValue;this.setValue=function setValue()
{delegate.setValue.apply(delegate,augmentWithInteractive(arguments));return delegate.proxy(proxyOptions);};this.getText=delegate.getText;this.setText=function setText()
{delegate.setText.apply(delegate,augmentWithInteractive(arguments));return delegate.proxy(proxyOptions);};this.getField=delegate.getField;this.getSublistField=delegate.getSublistField;this.getLineCount=delegate.getLineCount;this.insertLine=function insertLine()
{var line=delegate.insertLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.removeLine=function removeLine()
{delegate.removeLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.findSublistLineWithValue=delegate.findSublistLineWithValue;this.cancelLine=function cancelLine()
{delegate.cancelLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.commitLine=function commitLine()
{delegate.commitLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.selectLine=function selectLine()
{var line=delegate.selectLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.selectNewLine=function selectNewLine()
{var line=delegate.selectNewLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.getCurrentSublistValue=delegate.getCurrentSublistValue;this.getSublistValue=delegate.getSublistValue;this.setCurrentSublistValue=function setCurrentSublistValue()
{delegate.setCurrentSublistValue.apply(delegate,augmentWithInteractive(arguments));return delegate.proxy(proxyOptions);};this.getCurrentSublistText=delegate.getCurrentSublistText;this.getSublistText=delegate.getSublistText;this.setCurrentSublistText=function setCurrentSublistText()
{delegate.setCurrentSublistText.apply(delegate,augmentWithInteractive(arguments));return delegate.proxy(proxyOptions);};this.getCurrentSublistIndex=delegate.getCurrentSublistIndex;this.hasSubrecord=delegate.hasSubrecord;this.getSubrecord=function getSubrecord()
{var subrecord=delegate.getSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeSubrecord=function removeSubrecord()
{delegate.removeSubrecord.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.hasSublistSubrecord=delegate.hasSublistSubrecord;this.hasCurrentSublistSubrecord=delegate.hasCurrentSublistSubrecord;this.getCurrentSublistSubrecord=function getCurrentSublistSubrecord()
{var subrecord=delegate.getCurrentSublistSubrecord.apply(delegate,arguments);return!subrecord?null:subrecord.proxy(proxyOptions);};this.removeCurrentSublistSubrecord=function removeCurrentSublistSubrecord()
{delegate.removeCurrentSublistSubrecord.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getCurrentSublistField=delegate.getCurrentSublistField;this.setMatrixHeaderValue=function setMatrixHeaderValue()
{delegate.setMatrixHeaderValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getMatrixHeaderValue=delegate.getMatrixHeaderValue;this.setMatrixSublistValue=function setMatrixSublistValue()
{delegate.setMatrixSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getMatrixSublistValue=delegate.getMatrixSublistValue;this.setCurrentMatrixSublistValue=function setCurrentMatrixSublistValue()
{delegate.setCurrentMatrixSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getCurrentMatrixSublistValue=delegate.getCurrentMatrixSublistValue;this.getMatrixHeaderField=delegate.getMatrixHeaderField;this.getMatrixSublistField=delegate.getMatrixSublistField;this.findMatrixSublistLineWithValue=delegate.findMatrixSublistLineWithValue;this.getMatrixHeaderCount=delegate.getMatrixHeaderCount;this.on=function on()
{delegate.on.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.off=function off()
{delegate.off.apply(delegate,arguments);return delegate.proxy(proxyOptions);};Object.defineProperty(this,'callRestrictedMethod',{get:function()
{return delegate.callRestrictedMethod;}});if(delegate._addToTemplateRenderer)
this._addToTemplateRenderer=delegate._addToTemplateRenderer;if(isCurrentRecord)
{if(delegate.toString()===constants.RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_RECORD)
{delete(this.save);delete(this.toJSON);delete(this.removeField);delete(this.getFields);delete(this.getSublists);delete(this.getSublistFields);delete(this.getCurrentSublistField);delete(this.on);delete(this.off);delete(this._addToTemplateRenderer);}}
if(isInteractive)
{if(delegate.toString()===constants.RECORD_UNDERLYING_IMPL_NAME.DOM_CURRENT_RECORD)
utilityFunctions.throwSuiteScriptError(error.Type.YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION);utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});this.copyLine=function copyLine()
{var line=delegate.copyLine.apply(delegate,arguments);return!!line?line:delegate.proxy(proxyOptions);};utilityFunctions.addReadOnlyNonEnumerableProperty(this,'query',function getQuery(){return delegate.query;});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'saveAndFetch',function getFunc_saveAndFetch(){return delegate.saveAndFetch;});this.getLine=delegate.getLine;this.getLines=delegate.getLines;this.getLinesIterator=delegate.getLinesIterator;this.addNewLine=delegate.addNewLine;this.commitLine.promise=function commitLinePromise()
{return delegate.commitLine.promise(delegate,arguments,proxyOptions);};}
return this;}
DynamicRecord.prototype=nsobject.getNewInstance();Object.freeze(DynamicRecord);return DynamicRecord;});define('N/record/proxy/readOnlySubrecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/environment'],function(nsobject,constants,utilityFunctions,environment)
{function ReadOnlySubrecord(delegate,isInteractive,isCurrentSubrecord)
{var proxyOptions=Object.freeze({isInteractive:isInteractive});utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return null;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return null;});this.getMacros=function getMacros()
{return delegate.getMacros();};this.getMacro=function getMacro(options)
{return delegate.getMacro(options);};this.executeMacro=function executeMacro(options)
{return delegate.executeMacro(options,isInteractive);};this.executeMacro.promise=function executeMacroPromise(options)
{return delegate.executeMacro.promise(options,isInteractive);};utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.toJSON=delegate.toJSON;this.toString=function(){return constants.SUBRECORD_MODE.READ_ONLY_SUBRECORD;};if(isCurrentSubrecord)
this.toString=function(){return constants.CURRENT_SUBRECORD_MODE.READ_ONLY_CURRENT_SUBRECORD;};this.getFields=delegate.getFields;this.getSublists=delegate.getSublists;this.getSublistFields=delegate.getSublistFields;this.getValue=delegate.getValue;this.getText=delegate.getText;this.getField=delegate.getField;this.getSublistField=delegate.getSublistField;this.getLineCount=delegate.getLineCount;this.findSublistLineWithValue=delegate.findSublistLineWithValue;this.getSublistValue=delegate.getSublistValue;this.getSublistText=delegate.getSublistText;if(isInteractive)
{utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isReadOnly',function(){return true;});utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});this.getLine=delegate.getLine;this.getLines=delegate.getLines;this.getLinesIterator=delegate.getLinesIterator;}
return this;}
ReadOnlySubrecord.prototype=nsobject.getNewInstance();Object.freeze(ReadOnlySubrecord);return ReadOnlySubrecord;});define('N/record/proxy/deferredDynamicSubrecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/environment'],function(nsobject,constants,utilityFunctions,environment)
{function DeferredDynamicSubrecord(delegate,isInteractive)
{var proxyOptions=Object.freeze({isInteractive:isInteractive});utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return null;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return null;});utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.getMessageService=delegate.getMessageService;this.toJSON=delegate.toJSON;this.toString=function(){return constants.SUBRECORD_MODE.DEFERRED_DYNAMIC_SUBRECORD;};this.removeField=function removeField()
{delegate.removeField.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getFields=delegate.getFields;this.getSublists=delegate.getSublists;this.getSublistFields=delegate.getSublistFields;this.getValue=delegate.getValue;this.setValue=function setValue()
{delegate.setValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getText=delegate.getText;this.setText=function setText()
{delegate.setText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getField=delegate.getField;this.getSublistField=delegate.getSublistField;this.getLineCount=delegate.getLineCount;this.insertLine=function insertLine()
{var line=delegate.insertLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.removeLine=function removeLine()
{delegate.removeLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.findSublistLineWithValue=delegate.findSublistLineWithValue;this.getSublistValue=delegate.getSublistValue;this.setSublistValue=function setSublistValue()
{delegate.setSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getSublistText=delegate.getSublistText;this.setSublistText=function setSublistText()
{delegate.setSublistText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};if(isInteractive)
{utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});this.getLine=delegate.getLine;this.getLines=delegate.getLines;this.getLinesIterator=delegate.getLinesIterator;}
return this;}
DeferredDynamicSubrecord.prototype=nsobject.getNewInstance();Object.freeze(DeferredDynamicSubrecord);return DeferredDynamicSubrecord;});define('N/record/proxy/dynamicSubrecord',['N/nsobject','N/record/recordConstants','N/utilityFunctions','N/error','N/environment'],function(nsobject,constants,utilityFunctions,error,environment)
{function DynamicSubrecord(delegate,isInteractive)
{var proxyOptions=Object.freeze({isInteractive:isInteractive});var that=this;function validateIfSubrecordIsDereferencedFromParent()
{if(delegate.isDereferencedFromParent&&delegate.isDereferencedFromParent())
utilityFunctions.throwSuiteScriptError(error.Type.OPERATION_IS_NOT_ALLOWED);}
utilityFunctions.addReadOnlyProperty(this,'id',function getId(){return null;});utilityFunctions.addReadOnlyProperty(this,'type',function getType(){return null;});this.getMessageService=delegate.getMessageService;this.getMacros=function getMacros()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getMacros(that);};this.getMacro=function getMacro(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getMacro(that,options);};this.executeMacro=function executeMacro(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.executeMacro(that,options);};this.executeMacro.promise=function executeMacroPromise(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.executeMacro.promise(that,options);};utilityFunctions.addReadOnlyProperty(this,'isDynamic',function getIsDynamic(){return delegate.isDynamic;});this.toJSON=delegate.toJSON;this.toString=function(){return constants.SUBRECORD_MODE.DYNAMIC_SUBRECORD;};this.removeField=function removeField()
{validateIfSubrecordIsDereferencedFromParent();delegate.removeField.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getFields=function getFields()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getFields();};this.getSublist=function getSublist(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublist(options);};this.getSublists=function getSublists()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublists();};this.getSublistFields=function getSublistFields(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublistFields(options);};this.getValue=function getValue(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getValue(options);};this.setValue=function setValue()
{validateIfSubrecordIsDereferencedFromParent();delegate.setValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getText=function getText(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getText(options);};this.setText=function setText()
{validateIfSubrecordIsDereferencedFromParent();delegate.setText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getField=function getField(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getField(options);};this.getSublistField=function getSublistField(options,fieldId,line)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublistField(options,fieldId,line);};this.getLineCount=function getLineCount(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getLineCount(options);};this.insertLine=function insertLine()
{validateIfSubrecordIsDereferencedFromParent();var line=delegate.insertLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.removeLine=function removeLine()
{validateIfSubrecordIsDereferencedFromParent();delegate.removeLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.findSublistLineWithValue=function findSublistLineWithValue(options,fieldId,value)
{validateIfSubrecordIsDereferencedFromParent();return delegate.findSublistLineWithValue(options,fieldId,value);};this.cancelLine=function cancelLine()
{validateIfSubrecordIsDereferencedFromParent();delegate.cancelLine.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.commitLine=function commitLine(options)
{validateIfSubrecordIsDereferencedFromParent();delegate.commitLine(options);return delegate.proxy(proxyOptions);};this.selectLine=function selectLine(options,line)
{validateIfSubrecordIsDereferencedFromParent();var line=delegate.selectLine(options,line);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.selectNewLine=function selectNewLine()
{validateIfSubrecordIsDereferencedFromParent();var line=delegate.selectNewLine.apply(delegate,arguments);if(isInteractive)
return line;else
return delegate.proxy(proxyOptions);};this.getCurrentSublistValue=function getCurrentSublistValue(options,fieldId)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getCurrentSublistValue(options,fieldId);};this.getSublistValue=function getSublistValue(options,fieldId,line)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublistValue(options,fieldId,line);};this.setCurrentSublistValue=function setCurrentSublistValue()
{validateIfSubrecordIsDereferencedFromParent();delegate.setCurrentSublistValue.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getCurrentSublistText=function getCurrentSublistText(options,fieldId)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getCurrentSublistText(options,fieldId);};this.getSublistText=function getSublistText(options,fieldId,line)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getSublistText(options,fieldId,line);};this.setCurrentSublistText=function setCurrentSublistText()
{validateIfSubrecordIsDereferencedFromParent();delegate.setCurrentSublistText.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.getCurrentSublistIndex=function getCurrentSublistIndex(options)
{validateIfSubrecordIsDereferencedFromParent();return delegate.getCurrentSublistIndex(options);};this.validate=function validate()
{validateIfSubrecordIsDereferencedFromParent();delegate.validate.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.clone=function clone()
{validateIfSubrecordIsDereferencedFromParent();var clone=delegate.clone.apply(clone,arguments);return clone.proxy(proxyOptions);};this.merge=function merge()
{validateIfSubrecordIsDereferencedFromParent();delegate.merge.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.on=function on()
{delegate.on.apply(delegate,arguments);return delegate.proxy(proxyOptions);};this.off=function off()
{delegate.off.apply(delegate,arguments);return delegate.proxy(proxyOptions);};if(isInteractive)
{utilityFunctions.addReadOnlyNonEnumerableProperty(this,'isInteractive',function(){return true;});this.getLine=function getLine()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getLine.apply(delegate,arguments);};this.getLines=function getLines()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getLines.apply(delegate,arguments);}
this.getLinesIterator=function getLines()
{validateIfSubrecordIsDereferencedFromParent();return delegate.getLinesIterator.apply(delegate,arguments);}
this.addNewLine=function()
{validateIfSubrecordIsDereferencedFromParent();return delegate.addNewLine.apply(delegate,arguments);};this.commitLine.promise=function commitLine()
{validateIfSubrecordIsDereferencedFromParent();return delegate.commitLine.promise(delegate,arguments,proxyOptions);};}
return this;}
DynamicSubrecord.prototype=nsobject.getNewInstance();Object.freeze(DynamicSubrecord);return DynamicSubrecord;});define('N/record/recordProxy',['N/utilityFunctions','N/record/recordConstants','N/error','N/record/proxy/readOnlyRecord','N/record/proxy/deferredDynamicRecord','N/record/proxy/dynamicRecord','N/record/proxy/readOnlySubrecord','N/record/proxy/deferredDynamicSubrecord','N/record/proxy/dynamicSubrecord','N/environment'],function(utilityFunctions,constants,error,ReadOnlyRecord,DeferredDynamicRecord,DynamicRecord,ReadOnlySubrecord,DeferredDynamicSubrecord,DynamicSubrecord,environment)
{function wrap(options,isCurrentRecord)
{var wrappedRecord;var record=options.delegate;var isReadOnly=!!options.isReadOnly;var isSubrecord=!!options.isSubrecord;var isDynamic=!!options.isDynamic;var isInteractive=!!options.isInteractive;if(isReadOnly)
{wrappedRecord=isSubrecord?new ReadOnlySubrecord(record,isInteractive,isCurrentRecord):new ReadOnlyRecord(record,isInteractive,isCurrentRecord);}
else if(!isDynamic)
{wrappedRecord=isSubrecord?new DeferredDynamicSubrecord(record,isInteractive,isCurrentRecord):new DeferredDynamicRecord(record,isInteractive,isCurrentRecord);}
else if(isDynamic)
{wrappedRecord=isSubrecord?new DynamicSubrecord(record,isInteractive,isCurrentRecord):new DynamicRecord(record,isInteractive,isCurrentRecord);}
else
{utilityFunctions.throwSuiteScriptError(error.Type.YOU_HAVE_ATTEMPTED_AN_UNSUPPORTED_ACTION);}
Object.freeze(wrappedRecord);return wrappedRecord;}
function isKindToAlwaysWrap(kind)
{return constants.ALL_RECORD_UNDERLYING_IMPL_NAMES.indexOf(kind)>=0;}
function isKindToNeverWrap(kind)
{return constants.ALL_RECORD_PROXY_NAMES.indexOf(kind)>=0;}
function alreadyIsProxy(options)
{var record=options.delegate;var kind=record.toString();if(isKindToAlwaysWrap(kind))
{return false;}
if(isKindToNeverWrap(kind))
{return true;}
return false;}
function supportsInteractiveApi(options)
{if(!!options.isClientRecord)
{if(!!options.isCurrentRecord)
{return environment.isNewUI();}
else
{return environment.isDebug();}}
else
{return false;}}
function proxy(proxyDelegate,recordOptions,proxyOptions)
{var isInteractive;if(supportsInteractiveApi(recordOptions))
{if(proxyOptions&&proxyOptions.hasOwnProperty('isInteractive'))
{isInteractive=proxyOptions.isInteractive;}
else
{utilityFunctions.throwSuiteScriptError(error.Type.MISSING_REQD_ARGUMENT,'recordProxy#proxy','proxyOptions.isInteractive');}}
else
{isInteractive=false;}
var recordProxyCreationOptions={delegate:proxyDelegate,isClientRecord:recordOptions.isClientRecord,isSubrecord:recordOptions.isSubrecord,isReadOnly:recordOptions.isReadOnly,isDynamic:recordOptions.isDynamic,isInteractive:isInteractive,isCurrentRecord:recordOptions.isCurrentRecord};return recordProxyCache.getCachedRecordInterfaceProxy(recordProxyCreationOptions);}
function unproxy(proxiedRecord)
{if(!proxiedRecord||!proxiedRecord.toString)
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_TYPE_ARG,'recordProxy#unproxy','proxiedRecord');return recordProxyCache.getProxysCachedRecordInterface(proxiedRecord);}
var recordProxyCache=(function RecordInterfaceProxyCacheClass()
{var allProxyCaches=[];function getProxyCache(delegate)
{var cachedEntry=allProxyCaches.filter(function(entry)
{return entry.record===delegate;})[0];if(!cachedEntry)
{cachedEntry={record:delegate,proxyCache:[]};allProxyCaches.push(cachedEntry);}
return cachedEntry.proxyCache;}
function getCachedRecordInterfaceProxy(options)
{var isReadOnly=options.isReadOnly||false;var isSubrecord=options.isSubrecord||false;var isDynamic=options.isDynamic||false;var isInteractive=options.isInteractive||false;var isCurrentRecord=options.isCurrentRecord||false;var unproxiedRecord=options.delegate;var wrapOptions={delegate:unproxiedRecord,isReadOnly:isReadOnly,isSubrecord:isSubrecord,isDynamic:isDynamic,isInteractive:isInteractive};if(alreadyIsProxy(wrapOptions))
{return unproxiedRecord;}
var cacheKey=isReadOnly+':'
+isSubrecord+':'
+isDynamic+':'
+isInteractive+':'
+isCurrentRecord;var proxyCache=getProxyCache(unproxiedRecord);var wrappedRecord=proxyCache[cacheKey];if(!wrappedRecord)
{wrappedRecord=wrap(wrapOptions,isCurrentRecord);proxyCache[cacheKey]=wrappedRecord;}
return wrappedRecord;}
function getProxysCachedRecordInterface(proxiedRecord)
{if(!alreadyIsProxy({delegate:proxiedRecord}))
return proxiedRecord;var unproxiedRecord=null;allProxyCaches.forEach(function(cache)
{for(var cacheKey in cache.proxyCache)
{if(cache.proxyCache.hasOwnProperty(cacheKey)&&proxiedRecord===cache.proxyCache[cacheKey])
unproxiedRecord=cache.record;}});return unproxiedRecord;}
return{getCachedRecordInterfaceProxy:getCachedRecordInterfaceProxy,getProxysCachedRecordInterface:getProxysCachedRecordInterface};})();return Object.freeze({proxy:proxy,unproxy:unproxy,supportsInteractiveApi:supportsInteractiveApi});});define('N/record/relatedRecord',['N/restricted/remoteApiBridge','N/restricted/invoker','N/error','N/nsobject','N/util/slaving','N/pagination/paginationObject','N/utilityFunctions','N/format'],function(remoteApi,invoker,error,nsobject,slaving,paginationObject,utilityFunctions,format){var SORTING_DIRECTION=["ASC","DESC"];var freezeObjectIfPossible=utilityFunctions.freezeObjectIfPossible;var LINK_TYPE=Object.freeze({NONE:"NONE",REGULAR:"REGULAR",POPUP:"POPUP"});function RelatedRecord(options)
{var that=this,id=options.id,notify=options.notify,sourceRecordType=options.owningRecordType,queryField=options.queryField,formUrl=options.queryUrl,currentView,customViews,exposedUtil={notify:notify,getQueryRequest:getQueryRequest};var searchDefinition;function initializeRelatedRecord(config)
{var views=config.customViews;var _customViews=[];views.forEach(function(v){if(v.isSelected)
currentView=v.id;_customViews.push(new CustomView(v));});utilityFunctions.checkArgs([currentView],['currentView'],'relatedRecord.initialize');customViews=freezeObjectIfPossible(_customViews);initializeSearchDefinition(config)}
initializeRelatedRecord(options);function validateView(viewId)
{var found=null;customViews.forEach(function(v){if(v.id===String(viewId))
found=v;});if(!found)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_CUSTOM_VIEW_VALUE,viewId);return found;}
function setView(view)
{var oldView=currentView;var result=validateView(view);currentView=String(view);postViewChanged(view,oldView);return result;}
function postViewChanged(view,oldView)
{var request=getQueryRequest(queryField);var relatedRecordObj=invoker(remoteApi,"getRelatedRecord",[sourceRecordType,request.url,request.payload],null,false);relatedRecordObj.currentView=view;initializeSearchDefinition(relatedRecordObj);}
function getQueryRequest(queryField)
{var request=slaving.cleanupQueryURL(formUrl);request.payload.q=queryField;request.payload.si="0";request.payload.machine=id;request.payload.si_searchid=currentView;return request;}
function initializeSearchDefinition(relatedRecordObj)
{relatedRecordObj.util=exposedUtil;searchDefinition=new RelatedRecordSearchDefinition(relatedRecordObj);}
function toJSON()
{return{id:that.id,currentView:that.currentView,customViews:that.customViews}}
function toString()
{return "record.RelatedRecord"}
Object.defineProperty(this,'searchDefinition',{get:function(){return searchDefinition},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'searchDefinition');},enumerable:true,configurable:false});Object.defineProperty(this,'customViews',{get:function(){return customViews;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'customViews');},enumerable:true,configurable:false});Object.defineProperty(this,'currentView',{get:function(){return validateView(currentView)},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'currentView');},enumerable:true,configurable:false});this.selectView=function selectView(options)
{var id;if(options!==undefined&&options!==null)
{id=options.id;}
utilityFunctions.checkArgs([id],['id'],'RelatedRecord.selectView');return setView(id);};this.toJSON=toJSON;this.toString=toString;}
RelatedRecord.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecord);function ReadonlyRelatedRecordSearchDefinition(searchDefinition)
{Object.defineProperty(this,'type',{value:searchDefinition.type,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'columns',{value:searchDefinition.columns,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'filters',{value:searchDefinition.filters,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'sortBy',{value:searchDefinition.sortBy,enumerable:true,configurable:false,writable:false});Object.defineProperty(this,'settings',{value:searchDefinition.settings,enumerable:true,configurable:false,});this.getFilterValue=searchDefinition.getFilterValue;this.toJSON=searchDefinition.toJSON;this.toString=function(){return searchDefinition.toString()+"(readonly)";}}
ReadonlyRelatedRecordSearchDefinition.prototype=nsobject.getNewInstance();freezeObjectIfPossible(ReadonlyRelatedRecordSearchDefinition);function RelatedRecordSearchDefinition(options)
{var that=this,notify=options.notify,currentView=options.currentView,_util=options.util,id=options.id,queryField=options.queryField,sourceRecordType=options.owningRecordType,searchType=options.recordType,formUrl=options.queryUrl,filterFieldMetadata,returnFieldMetadata,filters,columns,settings,filterFields,sortBy;function initializeSearchDefinition(config)
{var rawFilterFields=config.filterFields,rawReturnFields=config.fields,_returnFieldMetadata={},_columns=[],_settings=[],_filterFieldMetadata={},_filterFields=[],_sortBy;filters={};rawReturnFields.forEach(function(field){_returnFieldMetadata[field.id]=field;var c=new Column(field);_columns.push(freezeObjectIfPossible(c));});rawFilterFields.forEach(function(field){_filterFieldMetadata[field.id]=field;var f=new FilterField(field);_filterFields.push(freezeObjectIfPossible(f));setDefaultValue(filters,field);});if(config.defaultSortCol)
{_sortBy={};_sortBy.columnId=config.defaultSortCol;_sortBy.direction=config.defaultSortDir;}
returnFieldMetadata=freezeObjectIfPossible(_returnFieldMetadata);columns=freezeObjectIfPossible(_columns);settings=freezeObjectIfPossible(_settings);sortBy=freezeObjectIfPossible(_sortBy);filterFieldMetadata=freezeObjectIfPossible(_filterFieldMetadata);filterFields=freezeObjectIfPossible(_filterFields);}
initializeSearchDefinition(options);function resetFilters()
{filterFields.forEach(function(fieldObj){setDefaultValue(filters,filterFieldMetadata[fieldObj.id]);});}
function setDefaultValue(data,metadata)
{if(metadata.defaultValue)
{if(metadata.type==='select')
{if(!!metadata.isMultiSelect)
data[metadata.id]=metadata.defaultValue.split(String.fromCharCode(5));else
data[metadata.id]=metadata.defaultValue;}
else
data[metadata.id]=parseFilterValue(metadata,metadata.defaultValue);}}
function runPaged(){var pagedDataOptions=doGetPagedData(null);var pagedData=new RelatedRecordPagedData(postGetRelatedRecordPagedData(pagedDataOptions));return new paginationObject.PagedData(pagedData);}
function runPagedPromise()
{return new Promise(function(resolve,reject){function callback(result,exception){if(exception){reject(exception);}
else{var pagedData=new RelatedRecordPagedData(postGetRelatedRecordPagedData(result));resolve(new paginationObject.PagedData(pagedData));}}
try{doGetPagedData(callback);}
catch(e)
{reject(e);}});}
function getQueryRequestWithDynamicValues()
{var request=_util.getQueryRequest(queryField);updateSortingForQueryRequest(request.payload);updateFilterValuesForQueryRequest(request.payload);return request;}
function doGetPagedData(callback)
{var request=getQueryRequestWithDynamicValues();return invoker(remoteApi,'getRelatedRecordPagedData',[sourceRecordType,request.url,request.payload],callback,true);}
function postGetRelatedRecordPagedData(pagedDataOptions)
{pagedDataOptions.parent=that;var requestorConfiguration={rawUrl:formUrl,id:id,view:currentView,recordType:sourceRecordType,queryField:queryField,pageRanges:pagedDataOptions.pageRanges,dynamicValues:{}};updateSortingForQueryRequest(requestorConfiguration.dynamicValues);updateFilterValuesForQueryRequest(requestorConfiguration.dynamicValues);pagedDataOptions.pageRequestor=new RelatedRecordPageRequestor(requestorConfiguration);pagedDataOptions.returnFieldMetadata=returnFieldMetadata;return pagedDataOptions;}
function updateSortingForQueryRequest(payload){if(sortBy)
{payload.si_sortcol=returnFieldMetadata[sortBy.columnId].alias_key;payload.si_sortdir=sortBy.direction;}}
function updateFilterValuesForQueryRequest(payload){for(var fieldId in filters)
{if(filters.hasOwnProperty(fieldId))
payload['si_'+fieldId]=formatFilterValue(filterFieldMetadata[fieldId]);}}
function setSortBy(options)
{var columnId,direction;if(options!==undefined&&options!==null)
{columnId=options.columnId;direction=options.direction||'ASC';}
utilityFunctions.checkArgs([columnId],['columnId'],'RelatedRecord.sortBy');validateColumnId(columnId);validateDirection(direction);sortBy={columnId:columnId,direction:direction};}
function validateColumnId(columnId)
{if(!returnFieldMetadata.hasOwnProperty(columnId))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_COLUMN_FOR_SORTING,columnId);}
function validateDirection(dir)
{if(SORTING_DIRECTION.indexOf(dir)===-1)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_DIRECTION_FOR_SORTING,dir);}
function getSortBy()
{return sortBy;}
function getFilterValue(options)
{var fieldId;if(options!==undefined&&options!==null)
{fieldId=options.fieldId;}
utilityFunctions.checkArgs([fieldId],['fieldId'],'RelatedRecord.getFilterValue');return doGetFilterValue(fieldId);}
function doGetFilterValue(fieldId)
{if(filterFieldMetadata.hasOwnProperty(fieldId))
return(filters[fieldId]!==undefined)?filters[fieldId]:"";else
return undefined;}
function setFilterValue(options)
{var fieldId,value;if(options!==undefined&&options!==null)
{fieldId=options.fieldId;value=options.value;}
utilityFunctions.checkArgs([fieldId],['fieldId'],'RelatedRecord.setFilterValue');doSetFilterValue(fieldId,value);}
function doSetFilterValue(fieldId,value)
{var metadata=filterFieldMetadata[fieldId];if(!!metadata.isMultiSelect&&!util.isArray(value))
value=[value];filters[fieldId]=validateAndFormatFilterValue(metadata,value);}
function validateAndFormatFilterValue(metadata,value)
{if(!metadata)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FILTER_FIELD_FOR_CURRENT_VIEW,metadata.id);var formattedValue='';if(value&&value!==0&&value!==false)
{if(metadata.type==='select')
{formattedValue=validateSelectFilter(metadata,value);}
else if(metadata.type==='date')
formattedValue=validateDateFilter(metadata,value);else
formattedValue=String(value);}
return formattedValue;}
function validateSelectFilter(metadata,value)
{var input=util.isArray(value)?value:[value];input.forEach(function(v){var isValid=false;for(var index in metadata.options)
{if(v===metadata.options[index].id)
{isValid=true;break;}}
if(!isValid)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FIELD_VALUE,v,metadata.id);});return value;}
function validateDateFilter(metadata,toValidate)
{if(!(toValidate instanceof Date||Object.prototype.toString.call(toValidate)==='[object Date]'))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FIELD_VALUE,toValidate,metadata.id);return toValidate;}
function formatFilterValue(metadata)
{var formattedValue;var value=filters[metadata.id];if(!value||value==='')
{formattedValue='';}
else if(metadata.type==='select'&&!!metadata.isMultiSelect)
{value=(util.isArray(value))?value:[value];formattedValue=value.join(String.fromCharCode(5));}
else
{formattedValue=String(format.format({value:value,type:metadata.type}));}
return formattedValue;}
function parseFilterValue(metadata,value)
{if(metadata.type==='date')
{value=format.parse({value:value,type:metadata.type});}
return value;}
function toJSON()
{return{type:that.type,sortBy:that.sortBy,filters:filters,columns:that.columns,settings:that.settings}}
function toString()
{return "SearchDefinition"}
Object.defineProperty(this,'type',{get:function(){return searchType;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false});Object.defineProperty(this,'columns',{get:function(){return columns;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columns');},enumerable:true,configurable:false});Object.defineProperty(this,'settings',{get:function(){return settings;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'settings');},enumerable:true,configurable:false});Object.defineProperty(this,'filters',{get:function(){return filterFields;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'filters');},enumerable:true,configurable:false});Object.defineProperty(this,'sortBy',{get:getSortBy,set:setSortBy,enumerable:true,configurable:false});this.setFilterValue=setFilterValue;this.getFilterValue=getFilterValue;this.resetFilters=resetFilters;this.runPaged=runPaged;this.runPaged.promise=runPagedPromise;this.toJSON=toJSON;this.toString=toString;}
RelatedRecordSearchDefinition.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecordSearchDefinition);function RelatedRecordPageRequestor(config){var pageRequest=slaving.cleanupQueryURL(config.rawUrl);var sourceRecordType=config.recordType;var recordUrl=pageRequest.url;var payload=util.extend({q:config.queryField,machine:config.id,si_searchid:config.view},pageRequest.payload);payload=util.extend(config.dynamicValues,payload);function request(index,callback){payload.si=String(index);return invoker(remoteApi,'getRelatedRecordPage',[sourceRecordType,recordUrl,payload],callback,true);}
this.request=request;}
function FilterField(field)
{var that=this,options;Object.defineProperty(this,'id',{get:function(){return field.id;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'id');},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function(){return field.label;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'label');},enumerable:true,configurable:false});Object.defineProperty(this,'type',{get:function(){return field.type;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false});Object.defineProperty(this,'isHidden',{get:function(){return field.isHidden;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isHidden');},enumerable:true,configurable:false});Object.defineProperty(this,'isMultiSelect',{get:function(){return field.isMultiSelect;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'isMultiSelect');},enumerable:true,configurable:false});function getSelectOptions()
{if(!options)
{var options=[];if(field.options)
{field.options.forEach(function(v){options.push(freezeObjectIfPossible({value:v.id,text:v.text}));});}}
return options;}
function toJSON()
{return{id:that.id,type:that.type,label:that.label,isHidden:that.isHidden,isMultiSelect:that.isMultiSelect}}
if(that.type==='select')
{this.getSelectOptions=getSelectOptions;}
this.toJSON=toJSON;this.toString=function(){return "RelatedRecord.FilterField";}}
FilterField.prototype=nsobject.getNewInstance();freezeObjectIfPossible(FilterField);function Setting(field)
{var that=this;Object.defineProperty(this,'name',{get:function(){return field.name;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'name');},enumerable:true,configurable:false});Object.defineProperty(this,'value',{get:function(){return field.value;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'value');},enumerable:true,configurable:false});function toJSON()
{return{name:that.name,value:that.value}}
this.toJSON=toJSON;this.toString=function(){return "RelatedRecord.Setting";}}
Setting.prototype=nsobject.getNewInstance();freezeObjectIfPossible(Setting);function Column(field)
{var that=this;Object.defineProperty(this,'index',{get:function(){return field.index;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'index');},enumerable:true,configurable:false});Object.defineProperty(this,'columnId',{get:function(){return field.id;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'columnId');},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function(){return field.label;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'label');},enumerable:true,configurable:false});Object.defineProperty(this,'type',{get:function(){return field.type;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'type');},enumerable:true,configurable:false});Object.defineProperty(this,'recordType',{get:function(){return field.rec_type?field.rec_type:null;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'recordType');},enumerable:true,configurable:false});Object.defineProperty(this,'hasLink',{get:function(){return field.has_link;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'hasLink');},enumerable:true,configurable:false});Object.defineProperty(this,'linkType',{get:function(){return Object.keys(LINK_TYPE)[field.linktype];},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'linkType');},enumerable:true,configurable:false});function toJSON()
{return{index:that.index,columnId:that.columnId,label:that.label,type:that.type,recordType:that.recordType,hasLink:that.hasLink,linkType:that.linkType}}
this.toJSON=toJSON;this.toString=function(){return "RelatedRecord.Column";}}
Column.prototype=nsobject.getNewInstance();freezeObjectIfPossible(Column);function CustomView(view)
{var that=this;Object.defineProperty(this,'id',{get:function(){return view.id;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'id');},enumerable:true,configurable:false});Object.defineProperty(this,'text',{get:function(){return view.text;},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'text');},enumerable:true,configurable:false});function toJSON()
{return{id:that.id,text:that.text};}
function toString()
{return "RelatedRecord.CustomView";}
this.toJSON=toJSON;this.toString=toString;}
CustomView.prototype=nsobject.getNewInstance();freezeObjectIfPossible(CustomView);function RelatedRecordPageRange(options)
{function getIndex(){return parseInt(options.id,10);};function getCompoundLabel(){return options.text;};Object.defineProperty(this,'index',{get:function(){return getIndex();},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'index');},enumerable:true,configurable:false});Object.defineProperty(this,'compoundLabel',{get:function(){return getCompoundLabel();},set:function(){utilityFunctions.throwSuiteScriptError(error.Type.READ_ONLY_PROPERTY,'compoundLabel');},enumerable:true,configurable:false});this.getIndex=getIndex;this.getCompoundLabel=getCompoundLabel;}
RelatedRecordPageRange.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecordPageRange);function RelatedRecordPagedData(options)
{var that=this,pageRequestor=options.pageRequestor,readOnlyRelatedRecord=new ReadonlyRelatedRecordSearchDefinition(options.parent),returnFieldMetadata=options.returnFieldMetadata,totalRows=isNaN(options.totalRows)?-1:options.totalRows,pageSize=isNaN(options.pageSize)?-1:options.pageSize,pageRanges=Array.isArray(options.pageRanges)&&options.pageRanges.map(function(v,i,a){return new RelatedRecordPageRange(v);})||[],firstPageData=options.firstPageData;function createRelatedRecordPageInstance(configs)
{var options={parent:that,isFirst:configs.index===0,isLast:configs.index===pageRanges.length-1,pageRange:pageRanges[configs.index]};if(configs.page&&util.isArray(configs.page.data))
{var page=[];configs.page.data.forEach(function(row){page.push(new RelatedRecordResult({columns:configs.page.columns,row:row,returnFieldMetadata:returnFieldMetadata}));});options.data=page;}
return new RelatedRecordPage(options);}
function validateIndex(index)
{if(index<0||index>=pageRanges.length)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'fetch');}}
function getPage(index)
{validateIndex(index);var pageData=doGetPageRawResult(index,null);var page=createRelatedRecordPageInstance({index:index,page:pageData});return new paginationObject.Page(page);}
function getPagePromise(index)
{var result;if(index<0||index>=pageRanges.length)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: fetch.promise.',notifyOff:false}));}
else
{result=new Promise(function(resolve,reject){function callback(result,exception){if(exception){reject(exception);}
else{var page=createRelatedRecordPageInstance({index:index,page:result});resolve(new paginationObject.Page(page));}}
try{doGetPageRawResult(index,callback);}
catch(e)
{reject(e);}});}
return result;}
function doGetPageRawResult(index,callback)
{var pageData;if(index===0)
{pageData=(callback)?callback(firstPageData):firstPageData;}
else
{pageData=pageRequestor.request(index,callback);}
return pageData;}
function toJSON(){return{count:that.count,pageRanges:that.pageRanges,pageSize:that.pageSize,searchDefinition:that.searchDefinition}}
function toString()
{return "search.PagedData"}
this.searchDefinition=readOnlyRelatedRecord;this.pageRanges=pageRanges;this.pageSize=pageSize;this.count=totalRows;this.fetch=getPage;this.fetch.promise=getPagePromise;this.toJSON=toJSON;this.toString=toString;}
RelatedRecordPagedData.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecordPagedData);function RelatedRecordPage(options)
{var that=this,parentPagedData=options.parent,pageRange=options.pageRange;function getNextPage()
{if(that.isLast)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'next');}
return parentPagedData.fetch(pageRange.getIndex()+1);}
function getPrevPage()
{if(that.isFirst)
{utilityFunctions.throwSuiteScriptError(error.Type.INVALID_PAGE_RANGE,'prev');}
return parentPagedData.fetch(pageRange.getIndex()-1);}
function getNextPagePromise()
{var result;if(that.isLast)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: next.promise.',notifyOff:false}));}
else
{result=parentPagedData.fetch.promise(pageRange.getIndex()+1);}
return result;}
function getPrevPagePromise()
{var result;if(that.isFirst)
{result=Promise.reject(error.create({name:error.Type.INVALID_PAGE_RANGE,message:'Invalid page range: prev.promise.',notifyOff:false}));}
else
{result=parentPagedData.fetch.promise(pageRange.getIndex()-1);}
return result;}
this.data=options.data;this.pagedData=options.parent;this.pageRange=options.pageRange;this.isFirst=options.isFirst;this.isLast=options.isLast;this.next=getNextPage;this.prev=getPrevPage;this.next.promise=getNextPagePromise;this.prev.promise=getPrevPagePromise;}
RelatedRecordPage.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecordPage);function RelatedRecordResult(options)
{var returnFieldMetadata=options.returnFieldMetadata,dataByIndex=[],dataByFieldId={};(function(opt){var columns=opt.columns;var row=opt.row;row.forEach(function(v,i){dataByIndex[i]=v;dataByFieldId[columns[i]]=v;})})(options);function getValue(options)
{var index,columnId;if(options instanceof Column)
{index=options.index;columnId=options.columnId;}
else if(!!options&&utilityFunctions.isObject(options))
{columnId=options.columnId;}
utilityFunctions.checkArgs([columnId],['columnId'],'Result.getValue');return doGetValue(index,columnId);}
function doGetValue(index,id)
{var returnValue=doGetValueById(id);return returnValue;}
function doGetValueByIndex(index)
{if(index<0||index>=dataByIndex.length)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FIELD_INDEX,index);return dataByIndex[index];}
function doGetValueById(id)
{if(!returnFieldMetadata.hasOwnProperty(id))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_FIELD_ID,id);return dataByFieldId[returnFieldMetadata[id].alias];}
function toJSON()
{var toRet={};for(var id in returnFieldMetadata)
{if(returnFieldMetadata.hasOwnProperty(id))
toRet[id]=dataByFieldId[returnFieldMetadata[id].alias];}
return toRet;}
function toString()
{return "RelatedRecord.Result";}
this.getValue=getValue;this.toJSON=toJSON;this.toString=toString;}
RelatedRecordResult.prototype=nsobject.getNewInstance();freezeObjectIfPossible(RelatedRecordResult);function doGetRelatedRecord(options,callback)
{var rec=options!=null?options.record:null;var sublistId=options!=null?options.sublistId:null;utilityFunctions.checkArgs([rec,sublistId],['record','sublistId'],'relatedRecord.get');var request=rec.query;if(!request)
utilityFunctions.throwSuiteScriptError(error.Type.SSS_UNSUPPORTED_METHOD);request.payload['machine']=sublistId;request.payload['r']="T";return invoker(remoteApi,"getRelatedRecord",[rec.type,request.url,request.payload],callback,false);}
function getRelatedRecord(options)
{var relatedRecordObj=doGetRelatedRecord(options,null);relatedRecordObj.owningRecordType=options.record.type;return new RelatedRecord(relatedRecordObj);}
function promiseToGetRelatedRecord(options)
{var myPromise=new Promise(function(resolve,reject)
{function callback(result,exception)
{if(exception)
{reject(exception);return;}
result.owningRecordType=options.record.type;resolve(new RelatedRecord(result));}
try
{doGetRelatedRecord(options,callback);}
catch(e)
{reject(e);}});return myPromise;}
getRelatedRecord.promise=promiseToGetRelatedRecord;return{get:getRelatedRecord,LinkType:LINK_TYPE};});define('N/record/subrecordUtilityFunctions',['N/error','N/utilityFunctions','N/record/recordUtilityFunctions'],function(error,utilityFunctions,recordUtil){var getNextSysId=(function(){var nextSysId=Date.now();return function getNextSysId(){return nextSysId++;};}());function validateIfSummaryField(field,fieldId)
{if(field===null||field.getType()!=='summary')
{utilityFunctions.throwSuiteScriptError(error.Type.FIELD_1_IS_NOT_A_SUBRECORD_FIELD,fieldId);}}
return{SYS_OP:'sys_op',SYS_ID:'sys_id',SYS_PARENT_ID:'sys_parentid',getNextSysId:getNextSysId,validateIfSummaryField:validateIfSummaryField};});define('N/record/sublistLine',['N/record/recordUtilityFunctions','N/record/sublistLineEvent','N/eventEmitter'],function(recordUtil,sublistLineEvent,eventEmitter)
{function SublistLine(options)
{var that=this;var id,lineIndex,data={};var emitter=eventEmitter.create();if(options.toBeCloned)
{var toBeCloned=options.toBeCloned;var noCopyToDefaultMap=options.noCopyToDefaultMap;id=toBeCloned.id;if(options.lineIndex||options.lineIndex===0)
{lineIndex=options.lineIndex;}
else
lineIndex=-1;setValues(toBeCloned,noCopyToDefaultMap);}
else
{id=options.id;if(options.lineIndex||options.lineIndex===0)
{lineIndex=options.lineIndex;}
else
lineIndex=-1;if(options.defaultLineData)
{recordUtil.forEachProperty(options.defaultLineData,function(fieldId,value){data[fieldId]={value:value,legacyStringValue:value};})}}
Object.defineProperty(this,'id',{get:function()
{return id;},enumerable:true,configurable:false});Object.defineProperty(this,'index',{get:function()
{return lineIndex;},set:function(idx)
{lineIndex=parseInt(idx,10);},enumerable:true,configurable:false});function setValues(anotherLine,noCopyToDefaultMap)
{noCopyToDefaultMap=noCopyToDefaultMap||{};recordUtil.forEachProperty(anotherLine.getData(),function(fieldId,value){var oldValue=getFieldValue(fieldId);if(noCopyToDefaultMap.hasOwnProperty(fieldId))
{value={value:undefined,legacyStringValue:noCopyToDefaultMap[fieldId]};}
else if(!recordUtil.matchRecordFieldValueSchema(value))
{value=util.isArray(value)&&value.length===1?value[0]:value;value={value:undefined,legacyStringValue:value};}
data[fieldId]={value:value.value,legacyStringValue:value.legacyStringValue};var newValue=getFieldValue(fieldId);if(oldValue!==newValue)
{sublistLineEvent.updateField(emitter,that,fieldId,oldValue,newValue);}});}
this.setValues=setValues;function removeFieldValue(fieldId)
{if(data.hasOwnProperty(fieldId))
{var oldValue=getFieldValue(fieldId);delete data[fieldId];sublistLineEvent.updateField(emitter,that,fieldId,oldValue);}}
this.removeFieldValue=removeFieldValue;function setPrimitiveValue(fieldId,value)
{var oldValue=getFieldValue(fieldId);if(hasFieldValue(fieldId))
data[fieldId].value=value;else
data[fieldId]={value:value,legacyStringValue:undefined};var newValue=getFieldValue(fieldId);if(oldValue!==newValue)
{sublistLineEvent.updateField(emitter,that,fieldId,oldValue,newValue,true);}}
this.setPrimitiveValue=setPrimitiveValue;function hasFieldValue(fieldId){return data.hasOwnProperty(fieldId);}
this.hasFieldValue=hasFieldValue;function setFieldValue(fieldId,recordFieldValue)
{recordUtil.validateRecordFieldValueSchema(recordFieldValue);var oldValue=getFieldValue(fieldId);data[fieldId]=recordFieldValue;var newValue=getFieldValue(fieldId);if(oldValue!==newValue)
{sublistLineEvent.updateField(emitter,that,fieldId,oldValue,newValue);}}
this.setFieldValue=setFieldValue;function getFieldValue(fieldId)
{var fieldValue="";if(util.isObject(data[fieldId]))
{if(!!data[fieldId].value||data[fieldId].value===""||data[fieldId].value===0||data[fieldId].value===false)
fieldValue=data[fieldId].value;else
fieldValue=recordUtil.emptyIfNullOrUndefined(data[fieldId].legacyStringValue);}
return fieldValue;}
this.getFieldValue=getFieldValue;function getValueAsLegacyString(fieldId)
{var fieldValue="";if(util.isObject(data[fieldId]))
{if(!!data[fieldId].legacyStringValue||data[fieldId].legacyStringValue===""||data[fieldId].legacyStringValue===0||data[fieldId].legacyStringValue===false)
fieldValue=data[fieldId].legacyStringValue;}
return fieldValue;}
this.getValueAsLegacyString=getValueAsLegacyString;function getData()
{var toRet={};recordUtil.forEachProperty(data,function(fieldId,value){toRet[fieldId]=value;});return toRet;}
this.getData=getData;function toJSON()
{return data;}
this.toJSON=toJSON;this.on=emitter.on;this.off=emitter.off;}
return{create:function(options){return new SublistLine(options);},isInstance:function(obj){return obj instanceof SublistLine;}}});define('N/record/selectFieldOptionTextCache',[],function(){function createKey(sublistId,fieldId,value){return[sublistId,fieldId,value].join(String.fromCharCode(1));}
function SelectFieldOptionTextCache()
{var cache={};function set(sublistId,fieldId,value,text){cache[createKey(sublistId,fieldId,value)]=text;}
this.set=set;function get(sublistId,fieldId,value){return cache[createKey(sublistId,fieldId,value)];}
this.get=get;function has(sublistId,fieldId,value){return cache.hasOwnProperty(createKey(sublistId,fieldId,value));}
this.has=has;return this;}
return{create:function(){return new SelectFieldOptionTextCache();}};});define('N/util/uuid',[],function(){function getRandomHexString(length)
{var result='';while(result.length<length)
{result+=getHexString(getRandomValue());}
return result;}
function getRandomValue()
{return Math.floor(Math.random()*16);}
function getHexString(value)
{return value.toString(16);}
function generateV4()
{return getRandomHexString(8)+'-'+
getRandomHexString(4)+'-'+
'4'+getRandomHexString(3)+'-'+
getHexString(getRandomValue(1)&11|8)+getRandomHexString(3)+'-'+
getRandomHexString(12);}
return Object.freeze({generateV4:generateV4});});define('N/record/model',['N/record/recordUtilityFunctions','N/record/subrecordUtilityFunctions','N/record/sublistLine','N/record/selectFieldOptionTextCache','N/record/modelEvent','N/eventEmitter','N/util/uuid'],function(recordUtil,subrecordUtil,sublistLine,selectOptionTextCache,modelEvent,eventEmitter,uuid){function SublistsController()
{var that=this;var ID_FIELD='_id';var SEQUENCE_FIELD='_sequence';var sublists={};function getLineInstanceId(sublistLine)
{return sublistLine.getFieldValue(ID_FIELD);}
function getLineSequence(sublistLine)
{return sublistLine.getFieldValue(SEQUENCE_FIELD);}
function sublistExists(sublistId)
{return sublists.hasOwnProperty(sublistId);}
this.sublistExists=sublistExists;function getSublist(sublistId)
{if(!sublistExists(sublistId))
{sublists[sublistId]={};}
return sublists[sublistId];}
function getSublists(){return Object.keys(sublists);}
this.getSublists=getSublists;function hasSublistLine(sublistId,lineInstanceId)
{var hasLine=false;var hasSublist=sublistExists(sublistId);if(hasSublist)
{var sublist=getSublist(sublistId);hasLine=sublist.hasOwnProperty(lineInstanceId);}
return hasLine;}
this.hasSublistLine=hasSublistLine;function getSublistLine(sublistId,lineInstanceId)
{var sublistLine=null;var hasLine=hasSublistLine(sublistId,lineInstanceId);if(hasLine)
{var sublist=getSublist(sublistId);sublistLine=sublist[lineInstanceId];}
return sublistLine;}
this.getSublistLine=getSublistLine;function putSublistLine(sublistLine)
{var sublistId=sublistLine.id;var lineInstanceId=getLineInstanceId(sublistLine);var previousSublistLine=getSublistLine(sublistId,lineInstanceId);getSublist(sublistId)[lineInstanceId]=sublistLine;return previousSublistLine;}
this.putSublistLine=putSublistLine;function removeSublistLine(sublistId,lineInstanceId)
{var removedSublistLine=getSublistLine(sublistId,lineInstanceId);delete getSublist(sublistId)[lineInstanceId];return removedSublistLine;}
this.removeSublistLine=removeSublistLine;function getSublistLineCount(sublistId)
{return sublistExists(sublistId)&&Object.keys(getSublist(sublistId)).length||0;}
this.getSublistLineCount=getSublistLineCount;function getSublistLinesAsOrderedList(sublistId)
{return Object.keys(getSublist(sublistId)).map(function(lineInstanceId){return getSublistLine(sublistId,lineInstanceId);}).sort(function(line1,line2){return getLineSequence(line1)-getLineSequence(line2)});}
this.getSublistLinesAsOrderedList=getSublistLinesAsOrderedList;function getSublistLineInstanceIdsAsOrderedList(sublistId)
{return Object.keys(getSublist(sublistId)).sort(function(line1,line2){return getLineSequence(getSublistLine(sublistId,line1))
-getLineSequence(getSublistLine(sublistId,line2))});}
this.getSublistLineInstanceIdsAsOrderedList=getSublistLineInstanceIdsAsOrderedList;function getSequenceToInstanceIdMap(sublistId)
{return Object.keys(getSublist(sublistId)).reduce(function(result,lineInstanceId){result[getLineSequence(getSublistLine(sublistId,lineInstanceId))]=lineInstanceId;return result;},{});}
this.getSequenceToInstanceIdMap=getSequenceToInstanceIdMap;}
function SublistsSequenceToInstanceId(sublistsController)
{var sublists={};function update(sublistId)
{sublists[sublistId]=sublistsController.getSequenceToInstanceIdMap(sublistId);}
this.update=update;function get(sublistId,line)
{var sublist=sublists[sublistId];if(!sublist)
{update(sublistId);sublist=sublists[sublistId];}
return sublist[line];}
this.get=get;}
function SelectedLineController()
{var that=this;var sublists={};function sublistExists(sublistId)
{return sublists.hasOwnProperty(sublistId);}
function has(sublistId)
{var result=false;var hasSublist=sublistExists(sublistId);if(hasSublist)
{var thisIdList=sublists[sublistId];result=!!thisIdList&&(thisIdList.length>0);}
return result;}
this.has=has;function getLastAndPop(sublistId,shouldPop)
{var result=null;if(has(sublistId))
{var thisIdList=sublists[sublistId];if(!shouldPop)
thisIdList=thisIdList.slice(-1);result=thisIdList.pop();}
return result;}
function get(sublistId)
{return getLastAndPop(sublistId,false);}
this.get=get;function put(sublistId,lineInstanceId)
{var previousCurrentSublistLineInstanceId=get(sublistId);if(!has(sublistId))
sublists[sublistId]=[lineInstanceId];else
sublists[sublistId].push(lineInstanceId);return previousCurrentSublistLineInstanceId;}
this.put=put;function update(sublistId,lineInstanceId)
{remove(sublistId);put(sublistId,lineInstanceId);}
this.update=update;function remove(sublistId)
{return getLastAndPop(sublistId,true);}
this.remove=remove;}
function Model(options)
{var that=this;var recordType=options.type;var recordDataObj=options.data;var emitter=eventEmitter.create();var bodyFields={};var subrecordData={cache:options.subrecordCache};var sublists=new SublistsController();var sublistsLinesSequencesToInstanceIds=new SublistsSequenceToInstanceId(sublists);var sublistsBuffers=new SublistsController();var sublistsBuffersLinesSequencesToInstanceIds=new SublistsSequenceToInstanceId(sublistsBuffers);var sublistsSelectedLineInstanceIds=new SelectedLineController();var optionTextCache=selectOptionTextCache.create();(function constructor(recordDataObj)
{function bindCachingFunction(sublistId,fieldId){return function(value,text){optionTextCache.set(sublistId,fieldId,value,text);}}
(function initSubrecord(data)
{subrecordData.link=data.link||{};})(recordDataObj.subrecord||{});(function initBodyFields(fields)
{recordUtil.forEachProperty(fields,function(fieldId,value)
{var cacher=bindCachingFunction(undefined,fieldId);if(!recordUtil.matchRecordFieldValueSchema(value))
{value=util.isArray(value)&&value.length===1?value[0]:value;value=recordUtil.transformRawValueToFieldValueSchema(value,cacher);}
bodyFields[fieldId]=value;});if(!!subrecordData.link[recordType])
{if(bodyFields[subrecordUtil.SYS_ID]===undefined)
{var valueForSystemId=String(subrecordUtil.getNextSysId());bodyFields[subrecordUtil.SYS_ID]={value:valueForSystemId,legacyStringValue:valueForSystemId};bodyFields[subrecordUtil.SYS_PARENT_ID]={value:"0",legacyStringValue:"0"};}}})(recordDataObj.bodyField||{});(function initSublists(sublistData)
{for(var sublistId in sublistData)
{if(sublistData.hasOwnProperty(sublistId))
{var lines=sublistData[sublistId];lines.forEach(function(line,index)
{var uniqueId=uuid.generateV4();var sublistline=createSublistLine({id:sublistId,lineIndex:index,sequence:index,lineInstanceId:uniqueId});sublists.putSublistLine(sublistline);recordUtil.forEachProperty(line,function(fieldId,value){var cacher=bindCachingFunction(sublistId,fieldId);if(!recordUtil.matchRecordFieldValueSchema(value))
{value=util.isArray(value)&&value.length===1?value[0]:value;value=recordUtil.transformRawValueToFieldValueSchema(value,cacher)}
sublistline.setFieldValue(fieldId,value);});if(!!subrecordData.link[sublistId])
{if(sublistline.getFieldValue(subrecordUtil.SYS_ID)===undefined)
{var sys_id=String(subrecordUtil.getNextSysId());sublistline.setFieldValue(subrecordUtil.SYS_ID,{value:sys_id,legacyStringValue:sys_id});sublistline.setFieldValue(subrecordUtil.SYS_PARENT_ID,{value:"0",legacyStringValue:"0"});}}});sublistsLinesSequencesToInstanceIds.update(sublistId);}}})(recordDataObj.sublist||{});})(recordDataObj);this.on=emitter.on;this.off=emitter.off;function createSublistLine(options)
{var newSublistLine=sublistLine.create({id:options.id,lineIndex:options.lineIndex,toBeCloned:options.toBeCloned,defaultLineData:options.defaultLineData,noCopyToDefaultMap:options.noCopyToDefaultMap});var lineInstanceId=options.lineInstanceId||uuid.generateV4();newSublistLine.setPrimitiveValue('_id',lineInstanceId);var sequence=isNaN(options.sequence)?-1:options.sequence;newSublistLine.setPrimitiveValue('_sequence',sequence);var asBuffer=!!options.asBuffer;modelEvent.forwardSublistLineEvents(emitter,newSublistLine,asBuffer);modelEvent.createLine(emitter,newSublistLine,asBuffer,options.origin);return newSublistLine;}
function getSublistLineForInstance(sublistId,lineInstanceId,useBuffer)
{function getSublistCommittedLineForInstance(sublistId,lineInstanceId)
{return sublists.getSublistLine(sublistId,lineInstanceId);}
function getSublistBufferedLineForInstance(sublistId,lineInstanceId)
{var sublistLineBuffer=sublistsBuffers.getSublistLine(sublistId,lineInstanceId);if(!sublistLineBuffer)
{var sublistLine=getSublistCommittedLineForInstance(sublistId,lineInstanceId);if(!!sublistLine)
{sublistLineBuffer=createBuffer({line:sublistLine});}}
return sublistLineBuffer;}
return(!useBuffer?getSublistCommittedLineForInstance:getSublistBufferedLineForInstance)(sublistId,lineInstanceId);}
this.getSublistLineForInstance=getSublistLineForInstance;function getSublistSelectedLine(sublistId)
{var useBuffer=true;var lineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);var sublistLineBuffer=getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);return sublistLineBuffer;}
function removeLineBufferForInstance(sublistId,lineInstanceId,suppressEmit)
{var removedLine=null;if(sublistsBuffers.hasSublistLine(sublistId,lineInstanceId))
{var bufferIsSelected=lineInstanceId===sublistsSelectedLineInstanceIds.get(sublistId);if(bufferIsSelected){}
removedLine=sublistsBuffers.removeSublistLine(sublistId,lineInstanceId);modelEvent.unforwardSublistLineEvents(removedLine);sublistsBuffersLinesSequencesToInstanceIds.update(sublistId);var isBuffer=true;modelEvent.deleteLine(emitter,removedLine,isBuffer,!!suppressEmit);}
return removedLine;}
function removeCurrentLine(sublistId)
{if(sublistsSelectedLineInstanceIds.has(sublistId))
{var lineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);removeLineBufferForInstance(sublistId,lineInstanceId);}}
function updateSublistLineSequenceFromStartByAmount(sublistId,start,amount)
{sublists.getSublistLinesAsOrderedList(sublistId).filter(function(sublistline){return start<=sublistline.getFieldValue('_sequence');}).forEach(function(sublistline){var newSequence=sublistline.getFieldValue('_sequence')+amount;sublistline.setPrimitiveValue('_sequence',newSequence);sublistline.index+=amount;var id=sublistline.getFieldValue('_id');if(sublistsBuffers.hasSublistLine(sublistId,id))
{var sublistlineBuffer=sublistsBuffers.getSublistLine(sublistId,id);sublistlineBuffer.setPrimitiveValue('_sequence',newSequence);sublistlineBuffer.index+=amount;}});sublistsBuffers.getSublistLinesAsOrderedList(sublistId).filter(function(sublistlineBuffer){var isStartOrGreater=start<=sublistlineBuffer.getFieldValue('_sequence');var isUncommitted=!sublists.hasSublistLine(sublistId,sublistlineBuffer.getFieldValue('_id'));return isStartOrGreater&&isUncommitted;}).forEach(function(sublistlineBuffer){var newSequence=sublistlineBuffer.getFieldValue('_sequence')+amount;sublistlineBuffer.setPrimitiveValue('_sequence',newSequence);sublistlineBuffer.index+=amount;});}
function updateSublistLineSequenceFromStartByPos1(sublistId,start)
{updateSublistLineSequenceFromStartByAmount(sublistId,start,1);}
function updateSublistLineSequenceFromStartByNeg1(sublistId,start)
{updateSublistLineSequenceFromStartByAmount(sublistId,start,-1);}
function runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,func,thisArg,argList)
{try
{sublistsSelectedLineInstanceIds.put(sublistId,lineInstanceId);func.apply(thisArg,argList);}
finally
{sublistsSelectedLineInstanceIds.remove(sublistId);}}
this.runFunctionWhileSilentlySelectingLine=runFunctionWhileSilentlySelectingLine;function doSelect(sublistId,sublistline,isMultilineEditable)
{var isBuffer=true;var previousSelectedLineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);if(previousSelectedLineInstanceId!==null&&!sublists.hasSublistLine(sublistId,previousSelectedLineInstanceId)&&!isMultilineEditable)
{removeLineBufferForInstance(sublistId,previousSelectedLineInstanceId);}
sublistsSelectedLineInstanceIds.update(sublistId,sublistline.getFieldValue('_id'));modelEvent.selectLine(emitter,sublistline,isBuffer);}
function doAdd(sublistId,sublistline,isInsertLineWhileMultilineEditable)
{if(isInsertLineWhileMultilineEditable)
{sublistsBuffers.putSublistLine(sublistline);}
else
{sublists.putSublistLine(sublistline);}
sublistsLinesSequencesToInstanceIds.update(sublistId);sublistsBuffersLinesSequencesToInstanceIds.update(sublistId);modelEvent.insertLine(emitter,sublistline);}
function doInsert(sublistId,sublistline,isMultilineEditable)
{var line=sublistline.getFieldValue('_sequence');updateSublistLineSequenceFromStartByPos1(sublistId,line);doAdd(sublistId,sublistline,isMultilineEditable);}
function doUpdate(sublistId,sublistline)
{sublists.putSublistLine(sublistline);modelEvent.updateLine(emitter,sublistline);}
function createBuffer(options){var sublistLineOptions={asBuffer:true};if(!!options.line)
{sublistLineOptions.id=options.line.id;sublistLineOptions.lineInstanceId=options.line.getFieldValue('_id');sublistLineOptions.lineIndex=options.line.index;sublistLineOptions.sequence=options.line.getFieldValue('_sequence');sublistLineOptions.toBeCloned=options.line;}
else
{sublistLineOptions.id=options.sublistId;sublistLineOptions.lineInstanceId=options.lineInstanceId;sublistLineOptions.lineIndex=options.index;sublistLineOptions.sequence=options.sequence;sublistLineOptions.defaultLineData=options.defaultLineData;}
var sublistlineBuffer=createSublistLine(sublistLineOptions);sublistsBuffers.putSublistLine(sublistlineBuffer);sublistsBuffersLinesSequencesToInstanceIds.update(sublistLineOptions.id);return sublistlineBuffer;}
function updateNewLineBufferWithCopy(sublistLineOptions)
{var fromBuffer=true;util.extend(sublistLineOptions,{origin:modelEvent.Origin.COPY});removeLineBufferForInstance(sublistLineOptions.id,sublistLineOptions.lineInstanceId);var newNewLineBuffer=doCopyLine(sublistLineOptions);modelEvent.updateLine(emitter,newNewLineBuffer,fromBuffer);modelEvent.selectLine(emitter,newNewLineBuffer,fromBuffer);return newNewLineBuffer.getFieldValue('_id');}
this.updateNewLineBufferWithCopy=updateNewLineBufferWithCopy;function doCopyLine(sublistLineOptions)
{var newNewLineBuffer=createSublistLine(sublistLineOptions);sublistsBuffers.putSublistLine(newNewLineBuffer);sublistsBuffersLinesSequencesToInstanceIds.update(sublistLineOptions.id);return newNewLineBuffer;}
function putCopyIntoNewLineBuffer(sublistId,line,isMultilineEditable,noCopyToDefaultMap)
{var useBuffer=true;var newLineIndex=isMultilineEditable?getNextNewLineIndex_MLB(sublistId):getSublistNewLineIndex(sublistId);var previousNewLineInstanceId=getSublistLineInstanceIdForIndex(sublistId,newLineIndex,useBuffer);var wasPreviousNewLineSelected=sublistsSelectedLineInstanceIds.get(sublistId)===previousNewLineInstanceId;var sublistLineOptions={asBuffer:useBuffer,id:sublistId,lineIndex:newLineIndex,sequence:newLineIndex,toBeCloned:line,origin:modelEvent.Origin.COPY,noCopyToDefaultMap:noCopyToDefaultMap};if(!isMultilineEditable)
{removeLineBufferForInstance(sublistId,previousNewLineInstanceId);}
var newNewLineBuffer=doCopyLine(sublistLineOptions);var newNewLineInstanceId=newNewLineBuffer.getFieldValue('_id');if(wasPreviousNewLineSelected&&!isMultilineEditable)
{sublistsSelectedLineInstanceIds.update(sublistId,newNewLineInstanceId);}
return newNewLineInstanceId;}
this.putCopyIntoNewLineBuffer=putCopyIntoNewLineBuffer;function getSublists()
{return sublists.getSublists();}
this.getSublists=getSublists;function getSublistLineCount(sublistId)
{return sublists.getSublistLineCount(sublistId);}
this.getSublistLineCount=getSublistLineCount;function getSublistLineCountWithAllNewLines(sublistId)
{return sublistsBuffers.getSublistLineCount(sublistId);}
this.getSublistLineCountWithAllNewLines=getSublistLineCountWithAllNewLines;function getSublistNewLineIndex(sublistId)
{return getSublistLineCount(sublistId);}
this.getSublistNewLineIndex=getSublistNewLineIndex;function getNextNewLineIndex_MLB(sublistId)
{var lastUncommitted=sublistsBuffers.getSublistLinesAsOrderedList(sublistId).slice(-1).pop();var lastCommitted=sublists.getSublistLinesAsOrderedList(sublistId).slice(-1).pop();var lastUncommittedIndex=!!lastUncommitted?lastUncommitted.getFieldValue("_sequence"):-1;var lastCommittedIndex=!!lastCommitted?lastCommitted.getFieldValue("_sequence"):-1;return Math.max(lastCommittedIndex,lastUncommittedIndex)+1;}
this.getNextNewLineIndex_MLB=getNextNewLineIndex_MLB;function getSublistSelectedLineInstanceId(sublistId)
{return sublistsSelectedLineInstanceIds.get(sublistId);}
this.getSublistSelectedLineInstanceId=getSublistSelectedLineInstanceId;function isSublistLineInstanceIdSelected(sublistId,lineInstanceId)
{var selectedLineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);return lineInstanceId===selectedLineInstanceId;}
this.isSublistLineInstanceIdSelected=isSublistLineInstanceIdSelected;function isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer,allowFallback)
{var sublistsController=useBuffer?sublistsBuffers:sublists;var isValid=sublistsController.hasSublistLine(sublistId,lineInstanceId);if(!isValid&&useBuffer&&!!allowFallback)
isValid=sublists.hasSublistLine(sublistId,lineInstanceId);return isValid;}
this.isSublistLineInstanceIdValid=isSublistLineInstanceIdValid;function getSublistLineInstanceIdForIndex(sublistId,line,useBuffer)
{var lineInstanceId=null;if(!!useBuffer)
{lineInstanceId=sublistsBuffersLinesSequencesToInstanceIds.get(sublistId,line);}
else
{lineInstanceId=sublistsLinesSequencesToInstanceIds.get(sublistId,line);}
lineInstanceId=lineInstanceId||null;return lineInstanceId;}
this.getSublistLineInstanceIdForIndex=getSublistLineInstanceIdForIndex;function getAllPossibleSequenceToLineInstanceIdsMap_MLB(sublistId)
{var committedMap=sublists.getSequenceToInstanceIdMap(sublistId);var uncommittedMap=sublistsBuffers.getSequenceToInstanceIdMap(sublistId);var mismatch=Object.keys(committedMap).filter({}.hasOwnProperty.bind(uncommittedMap)).filter(function(seq){return committedMap[seq]!==uncommittedMap[seq];});if(mismatch.length>0)
throw "ERROR ERROR. MISMATCH OF SEQUENCE TO LINEIDs FOUND: comm["+JSON.stringify(committedMap)+"] uncomm["+JSON.stringify(uncommittedMap)+"] bad idxs:"+mismatch;return util.extend(util.extend({},committedMap),uncommittedMap);}
function getSpecifiedLineInstanceIdByIndex(sublistId,index)
{var allSeqToInstId=getAllPossibleSequenceToLineInstanceIdsMap_MLB(sublistId);return allSeqToInstId.hasOwnProperty(index)?allSeqToInstId[index]:null;}
this.getSpecifiedLineInstanceIdByIndex=getSpecifiedLineInstanceIdByIndex;function lineIndexIsNewLine_MLB(sublistId,line)
{var uncommitted=sublistsBuffersLinesSequencesToInstanceIds.get(sublistId,line);var committed=sublistsLinesSequencesToInstanceIds.get(sublistId,line);return(uncommitted!==undefined)&&(committed===undefined)}
this.lineIndexIsNewLine_MLB=lineIndexIsNewLine_MLB;function updateCurrentLineToANewLine_MLB(sublistId,lineObj)
{var useBuffer=true;sublistsSelectedLineInstanceIds.update(sublistId,lineObj.getFieldValue('_id'));modelEvent.selectLine(emitter,lineObj,useBuffer);}
this.updateCurrentLineToANewLine_MLB=updateCurrentLineToANewLine_MLB;function getSublistLineInstanceIds(sublistId,isCommitted)
{var sublistList=[];if(isCommitted)
{sublistList=sublists.getSublistLineInstanceIdsAsOrderedList(sublistId);}
else
{var allSequenceToIdsMap=getAllPossibleSequenceToLineInstanceIdsMap_MLB(sublistId);sublistList=Object.keys(allSequenceToIdsMap).sort().map(function(seq){return allSequenceToIdsMap[seq];});}
return sublistList;}
this.getSublistLineInstanceIds=getSublistLineInstanceIds;function getBodyFieldIds()
{var fieldIds=[];for(var fieldId in bodyFields)
fieldIds.push(fieldId);return fieldIds;}
this.getBodyFieldIds=getBodyFieldIds;function getSublistLineFieldIds(sublistId,lineInstanceId,useBuffer)
{var fieldIds=null;var sublistLine=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);if(!!sublistLine)
{fieldIds=Object.keys(sublistLine.getData());}
return fieldIds;}
this.getSublistLineFieldIds=getSublistLineFieldIds;function getBodyValue(fieldId)
{var fieldValue="";if(util.isObject(bodyFields[fieldId]))
{if(!!bodyFields[fieldId].value||bodyFields[fieldId].value===""||bodyFields[fieldId].value===0||bodyFields[fieldId].value===false)
fieldValue=bodyFields[fieldId].value;else
fieldValue=recordUtil.emptyIfNullOrUndefined(bodyFields[fieldId].legacyStringValue);}
return fieldValue;}
this.getBodyValue=getBodyValue;function getSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer)
{var value=null;if(doesSublistExist(sublistId,useBuffer))
{var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);if(!!sublistline)
{value=sublistline.getFieldValue(fieldId);}}
return value;}
this.getSublistLineValue=getSublistLineValue;function getBodyValueAsLegacyString(fieldId)
{var fieldValue="";if(util.isObject(bodyFields[fieldId]))
{if(!!bodyFields[fieldId].legacyStringValue||bodyFields[fieldId].legacyStringValue===""||bodyFields[fieldId].legacyStringValue===0||bodyFields[fieldId].legacyStringValue===false)
fieldValue=bodyFields[fieldId].legacyStringValue;}
return fieldValue;}
this.getBodyValueAsLegacyString=getBodyValueAsLegacyString;function getSublistLineValueAsLegacyString(sublistId,lineInstanceId,fieldId,useBuffer)
{var value=null;if(doesSublistExist(sublistId,useBuffer))
{var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);if(!!sublistline)
{value=sublistline.getValueAsLegacyString(fieldId);}}
return value;}
this.getSublistLineValueAsLegacyString=getSublistLineValueAsLegacyString;function setBodyValue(fieldId,recordFieldValue)
{recordUtil.validateRecordFieldValueSchema(recordFieldValue);var oldValue=getBodyValue(fieldId);bodyFields[fieldId]=recordFieldValue;var newValue=getBodyValue(fieldId);if(oldValue!==newValue)
{modelEvent.updateField(emitter,fieldId,oldValue,newValue);}}
this.setBodyValue=setBodyValue;function setSublistLineValue(sublistId,lineInstanceId,fieldId,recordFieldValue,useBuffer)
{recordUtil.validateRecordFieldValueSchema(recordFieldValue);var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);if(!!sublistline)
{sublistline.setFieldValue(fieldId,recordFieldValue);}}
this.setSublistLineValue=setSublistLineValue;function setBodyValuePrimitive(fieldId,value)
{var oldValue=getBodyValue(fieldId);if(hasBodyValue(fieldId))
bodyFields[fieldId].value=value;else
bodyFields[fieldId]={value:value,legacyStringValue:undefined};var newValue=getBodyValue(fieldId);if(oldValue!==newValue)
{modelEvent.updateField(emitter,fieldId,oldValue,newValue,true);}}
this.setBodyValuePrimitive=setBodyValuePrimitive;function setSublistLineValuePrimitive(sublistId,lineInstanceId,fieldId,value,useBuffer)
{var sublistLine=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);sublistLine.setPrimitiveValue(fieldId,value);}
this.setSublistLineValuePrimitive=setSublistLineValuePrimitive;function hasBodyValue(fieldId)
{return bodyFields.hasOwnProperty(fieldId);}
this.hasBodyValue=hasBodyValue;function hasSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer)
{var result=false;if(doesSublistExist(sublistId,useBuffer))
{var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);if(!!sublistline)
{result=sublistline.hasFieldValue(fieldId);}}
return result;}
this.hasSublistLineValue=hasSublistLineValue;function doesSublistExist(sublistId,useBuffer)
{var sublistContainer=!!useBuffer?sublistsBuffers:sublists;return sublistContainer.sublistExists(sublistId);}
this.doesSublistExist=doesSublistExist;function removeBodyValue(fieldId)
{if(bodyFields.hasOwnProperty(fieldId)){var oldValue=getBodyValue(fieldId);delete bodyFields[fieldId];modelEvent.updateField(emitter,fieldId,oldValue);}}
this.removeBodyValue=removeBodyValue;function removeSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer)
{var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,!!useBuffer);sublistline.removeFieldValue(fieldId);}
this.removeSublistLineValue=removeSublistLineValue;function insertSublistLine(sublistId,beforeLineInstanceId,isMultilineEditable)
{var result=null;var beforeSublistline=(function(){var result=null;var useBuffer=null;if(sublists.hasSublistLine(sublistId,beforeLineInstanceId))
{useBuffer=false;}
else if(sublistsBuffers.hasSublistLine(sublistId,beforeLineInstanceId))
{useBuffer=true;}
if(useBuffer!==null)
{result=getSublistLineForInstance(sublistId,beforeLineInstanceId,useBuffer);}
return result;})();var line=!!beforeSublistline?beforeSublistline.index:Math.max(getNextNewLineIndex_MLB(sublistId)-1,0);var sublistline=createSublistLine({id:sublistId,lineIndex:line,sequence:line});doInsert(sublistId,sublistline,isMultilineEditable);result=sublistline.getFieldValue('_id');return result;}
this.insertSublistLine=insertSublistLine;function removeSublistLine(sublistId,lineInstanceId)
{if(sublists.hasSublistLine(sublistId,lineInstanceId))
{cancelSublistLine(sublistId,lineInstanceId,true);var sublistline=sublists.removeSublistLine(sublistId,lineInstanceId);modelEvent.unforwardSublistLineEvents(sublistline);var line=sublistline.getFieldValue('_sequence');updateSublistLineSequenceFromStartByNeg1(sublistId,line);sublistsLinesSequencesToInstanceIds.update(sublistId);sublistsBuffersLinesSequencesToInstanceIds.update(sublistId);modelEvent.deleteLine(emitter,sublistline);}}
this.removeSublistLine=removeSublistLine;function selectSublistLine(sublistId,lineInstanceId,isMultilineEditable)
{var useBuffer=false;var sublistLine=getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);var sublistlineBuffer=createBuffer({line:sublistLine});doSelect(sublistId,sublistlineBuffer,isMultilineEditable);}
this.selectSublistLine=selectSublistLine;function selectNewSublistLine(sublistId,defaultValues)
{var line=getSublistNewLineIndex(sublistId);var selectedLineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);var wasCommitted=sublists.hasSublistLine(sublistId,selectedLineInstanceId);if(!wasCommitted)
{removeSublistLine(sublistId,selectedLineInstanceId);}
var newSublistline=createBuffer({sublistId:sublistId,index:line,sequence:line,defaultLineData:defaultValues});doSelect(sublistId,newSublistline);return sublistsSelectedLineInstanceIds.get(sublistId);}
this.selectNewSublistLine=selectNewSublistLine;function addNewSublistLine(sublistId,defaultValues)
{var newLineIdx=getNextNewLineIndex_MLB(sublistId);var newSublistline=createBuffer({sublistId:sublistId,index:newLineIdx,sequence:newLineIdx,defaultLineData:defaultValues});return newSublistline.getFieldValue('_id');}
this.addNewSublistLine=addNewSublistLine;function cancelSublistLine(sublistId,lineInstanceId,suppressEmit)
{var removedLine=null;if(sublistsBuffers.hasSublistLine(sublistId,lineInstanceId))
{removedLine=removeLineBufferForInstance(sublistId,lineInstanceId,!!suppressEmit);}
if(!sublists.hasSublistLine(sublistId,lineInstanceId)&&removedLine!=null)
{updateSublistLineSequenceFromStartByNeg1(sublistId,removedLine.getFieldValue("_sequence"));sublistsLinesSequencesToInstanceIds.update(sublistId);sublistsBuffersLinesSequencesToInstanceIds.update(sublistId);}}
this.cancelSublistLine=cancelSublistLine;function resetSublistLine(sublistId,lineInstanceId,defaultValues,useBuffer)
{if(isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer))
{var sublistline=getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);var newSublistlineOptions={asBuffer:!!useBuffer,id:sublistline.id,lineInstanceId:sublistline.getFieldValue('_id'),lineIndex:sublistline.index,sequence:sublistline.getFieldValue('_sequence'),defaultLineData:defaultValues};var resetSublistline=createSublistLine(newSublistlineOptions);var sublistsController=useBuffer?sublistsBuffers:sublists;sublistsController.putSublistLine(resetSublistline);}}
this.resetSublistLine=resetSublistLine;function getSublistSelectedLineIndex(sublistId)
{var result=-1;var sublistline=getSublistSelectedLine(sublistId);if(!!sublistline)
{result=sublistline.index;}
return result;}
this.getSublistSelectedLineIndex=getSublistSelectedLineIndex;function commitSublistLine(sublistId,lineInstanceId)
{var useBuffer=true;var sublistlineBuffer=getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);if(!!sublistlineBuffer)
{var isSelected=sublistsSelectedLineInstanceIds.get(sublistId)===lineInstanceId;removeLineBufferForInstance(sublistId,lineInstanceId,true);modelEvent.forwardSublistLineEvents(emitter,sublistlineBuffer,false);if(!sublists.hasSublistLine(sublistId,sublistlineBuffer.getFieldValue('_id')))
{doAdd(sublistId,sublistlineBuffer);if(isSelected)
modelEvent.selectLine(emitter,sublistlineBuffer,useBuffer);}
else
{doUpdate(sublistId,sublistlineBuffer);}}}
this.commitSublistLine=commitSublistLine;function getSubrecordDataForSubmission()
{var result;var subrecordLinks=Object.keys(subrecordData.link);if(subrecordLinks.length>0)
{result={};result['subrecord_parent']={fields:['parent'],size:subrecordLinks.length,data:subrecordLinks.map(function(v,i,a)
{return[v];})};}
subrecordLinks.forEach(function(sublistId,i1,a1)
{var link=subrecordData.link[sublistId];result['children_'+sublistId]={fields:['childfieldname','childmachinename','childlinktype','childtype'],size:link.length,data:link.map(function(v2,i2,a2)
{return[v2.childfieldname,v2.childmachinename,v2.childlinktype,v2.childtype];})};link.forEach(function(v2,i2,a2)
{var fieldId=v2.childfieldname,subrecords;if(!!v2.sublinks&&v2.sublinks.length>0)
{result['children_'+v2.childmachinename]={fields:['childfieldname','childmachinename','childlinktype','childtype'],size:v2.sublinks.length,data:v2.sublinks.map(function(v3,i3,a3){return[v3.childfieldname||null,v3.childmachinename,v3.childlinktype,v3.childtype];})};}
if(!!v2.sublinks&&v2.sublinks.length>0)
{result['children_'+v2.childmachinename]={fields:['childfieldname','childmachinename','childlinktype','childtype'],size:v2.sublinks.length,data:v2.sublinks.map(function(v3,i3,a3){return[v3.childfieldname||null,v3.childmachinename,v3.childlinktype,v3.childtype];})};}
if(sublistId===recordType)
{subrecords=subrecordData.cache.get(null,fieldId);subrecords=subrecords===undefined?[]:[subrecords];}
else
{subrecords=subrecordData.cache.getSublist(sublistId);subrecords=subrecords===undefined?[]:Object.keys(subrecords).map(function(lineInstanceId){var cache=subrecords[lineInstanceId];return!!cache&&cache.get(fieldId)||undefined;}).reduce(function(p,c){if(c!==undefined)
{p.push(c);}
return p;},[]);}
if(subrecords.length>0)
{subrecords.forEach(function(v3,i3,a3)
{var initial=v3.initial,current=v3.current;var isExistingSubrecord=!!initial&&!!current&&initial.getValueAsLegacyString(subrecordUtil.SYS_ID)===current.getValueAsLegacyString(subrecordUtil.SYS_ID);if(isExistingSubrecord)
{storeSubrecordAsSublist(result,current,'EDIT',v2.childmachinename,v2.sublinks);}
else
{var isNewSubrecord=!!current;if(isNewSubrecord)
{storeSubrecordAsSublist(result,current,'CREATE',v2.childmachinename,v2.sublinks);}
var isSubrecordDeleted=!!initial;if(isSubrecordDeleted)
{storeSubrecordAsSublist(result,initial,'DELETE',v2.childmachinename,v2.sublinks);}}});}});});return result;}
this.getSubrecordDataForSubmission=getSubrecordDataForSubmission;function storeSubrecordAsSublist(data,record,operation,childmachinename,sublinks)
{var fieldIds=[subrecordUtil.SYS_OP].concat(record.getFields());var values=fieldIds.map(function(fieldId){return recordUtil.emptyIfNullOrUndefined(record.getValueAsLegacyString(fieldId));});values[0]=operation;storeAsSublist(data,childmachinename,fieldIds,values);storeSubrecordSublistsAsSublist(data,record,operation,sublinks);}
function storeSubrecordSublistsAsSublist(data,record,operation,sublinks)
{if(!!sublinks&&sublinks.length>0)
{sublinks.forEach(function(sublink){storeSubrecordSublistAsSublist(data,record,sublink.childtype,operation,sublink.childmachinename,sublink.childfieldname);});}}
function storeSubrecordSublistAsSublist(data,record,sublistId,operation,childmachinename,childfieldname)
{var fieldIds,values;if(childfieldname==='null')
{fieldIds=[subrecordUtil.SYS_OP,subrecordUtil.SYS_PARENT_ID,subrecordUtil.SYS_ID].concat(record.getSublistFields(sublistId));for(var line_0=0;line_0<record.doGetLineCount(sublistId);line_0+=1)
{values=fieldIds.map(function(fieldId){return recordUtil.emptyIfNullOrUndefined(record.getSublistLineValueAsLegacyString(sublistId,fieldId,line_0));});values[0]=operation;if(operation==='EDIT')
{if(!record.getSublistState(sublistId).isLineChanged(line_0))
{values[0]='VIEW';}
if(record.getSublistState(sublistId).isLineInserted(line_0))
{values[0]='CREATE';}}
storeAsSublist(data,childmachinename,fieldIds,values);}}}
function storeAsSublist(sublistData,sublistId,fieldIds,values)
{sublistData[sublistId]=sublistData[sublistId]||{};sublistData[sublistId].fields=sublistData[sublistId].fields||fieldIds;sublistData[sublistId].data=sublistData[sublistId].data||[];sublistData[sublistId].data.push(values);sublistData[sublistId].size=sublistData[sublistId].data.length;}
function getData()
{return{body:bodyFields,sublists:getSublistData()};}
this.getData=getData;function getSublistData()
{var sublistData={};sublists.getSublists().forEach(function(sublistId){var currentLine=getSublistSelectedLine(sublistId);sublistData[sublistId]={currentline:(!!currentLine?currentLine.toJSON():{})};sublists.getSublistLinesAsOrderedList(sublistId).forEach(function(sublistline){sublistData[sublistId]['line '+sublistline.getFieldValue('_sequence')]=sublistline.toJSON();});});return sublistData;}
this.getSublistData=getSublistData;function getSublistLineJSON(sublistId,lineInstanceId,useBuffer)
{return getSublistLineForInstance(sublistId,lineInstanceId,useBuffer).toJSON();}
this.getSublistLineJSON=getSublistLineJSON;function getClonedData()
{return{bodyField:getClonedBodyFields(),sublist:getClonedSublistData(),subrecord:recordDataObj.subrecord};}
this.getClonedData=getClonedData;function cloneRecordValue(val)
{var clone=val;if(util.isObject(val))
{clone=recordUtil.clone({},val);}
else if(util.isArray(val))
{clone=val.map(function(entry){return cloneRecordValue(entry);})}
else if(util.isDate(val))
{clone=new Date(val);}
return clone;}
function getClonedBodyFields()
{var clone={};recordUtil.forEachProperty(bodyFields,function(fieldId,value){clone[fieldId]=cloneRecordValue(value);});return clone;}
function getClonedSublistData()
{return getSublists().reduce(function(result,sublistId){result[sublistId]=sublists.getSublistLinesAsOrderedList(sublistId).map(function(sublistline){var rawData=sublistline.getData();var clonedLine={};recordUtil.forEachProperty(rawData,function(fieldId,value){clonedLine[fieldId]=cloneRecordValue(value);});return clonedLine;});return result;},{});}
function toJSON()
{var currentLines={};return{body:bodyFields,sublists:getSublists().reduce(function(result,sublistId){result[sublistId]=sublists.getSublistLinesAsOrderedList(sublistId);return result;},{}),currentsublists:sublistsBuffers.getSublists().reduce(function(result,sublistId){if(sublistsSelectedLineInstanceIds.has(sublistId))
{var lineInstanceId=sublistsSelectedLineInstanceIds.get(sublistId);result[sublistId]=sublistsBuffers.getSublistLine(sublistId,lineInstanceId);}
return result;},{})};}
function shouldSetupSublistSystemId(id)
{var hasExplicitLink=!!subrecordData.link[id];var hasImplicitLink=!!getBodyValue(subrecordUtil.SYS_ID)&&!!getBodyValue(subrecordUtil.SYS_PARENT_ID)&&getBodyValue(subrecordUtil.SYS_PARENT_ID)!=='0';return hasExplicitLink||hasImplicitLink;}
this.shouldSetupSublistSystemId=shouldSetupSublistSystemId;function getSelectOptionTextFromCache(sublistId,fieldId,value)
{return optionTextCache.get(sublistId,fieldId,value);}
this.getSelectOptionTextFromCache=getSelectOptionTextFromCache;function cacheSelectOptionText(sublistId,fieldId,value,text)
{optionTextCache.set(sublistId,fieldId,value,text);}
this.cacheSelectOptionText=cacheSelectOptionText;}
return{create:function create(options)
{return new Model(options);}};});define('N/record/recordCache',[],function(){function RecordCache()
{var cache={};function has(fieldId)
{return cache.hasOwnProperty(fieldId);}
this.has=has;function put(fieldId,object)
{cache[fieldId]=object;}
this.put=put;function get(fieldId)
{return cache[fieldId];}
this.get=get;function invalidate(fieldId)
{delete cache[fieldId];}
this.invalidate=invalidate;function keys()
{var keys=[];for(var k in cache)
if(cache.hasOwnProperty(k))
keys[keys.length]=k;return keys;}
this.keys=keys;return this;}
return{create:function(){return new RecordCache();}};});define('N/record/recordCacheController',['N/record/recordCache'],function(recordCache){function RecordCacheController()
{var body=recordCache.create();var sublists={};var sublistsBuffers={};function has(sublistId,fieldId,lineId,useBuffer)
{var result=false;var cache=getRecordCache(sublistId,lineId,useBuffer);if(cache)
result=cache.has(fieldId);return result;}
this.has=has;function put(sublistId,fieldId,lineId,object,useBuffer)
{var cache=getRecordCache(sublistId,lineId,useBuffer);if(cache)
cache.put(fieldId,object);}
this.put=put;function get(sublistId,fieldId,lineId,useBuffer)
{var obj;var cache=getRecordCache(sublistId,lineId,useBuffer);if(cache)
obj=cache.get(fieldId);return obj;}
this.get=get;function invalidate(sublistId,fieldId,lineId,useBuffer)
{var cache=null;if(!sublistId)
{cache=getRecordCache();}
else
{if(!!lineId)
{if(!!fieldId)
{cache=getRecordCache(sublistId,lineId,useBuffer);}
else
{var sublist=!!useBuffer?getSublistBuffer(sublistId):getSublist(sublistId);delete sublist[lineId];}}
else
{if(useBuffer)
{delete sublistsBuffers[sublistId];}
else
{delete sublists[sublistId];}}}
if(!!cache)
{cache.invalidate(fieldId);}}
this.invalidate=invalidate;function invalidateSublist(sublistId)
{invalidate(sublistId,null,null,false);}
this.invalidateSublist=invalidateSublist;function getRecordCache(sublistId,lineId,useBuffer)
{var cache=null;if(!!sublistId)
{cache=getSublistCache(sublistId,lineId,useBuffer);}
else
{cache=body}
return cache;}
function getSublist(sublistId)
{if(!sublists.hasOwnProperty(sublistId))
sublists[sublistId]={};return sublists[sublistId];}
this.getSublist=getSublist;function getSublistBuffer(sublistId)
{if(!sublistsBuffers.hasOwnProperty(sublistId))
sublistsBuffers[sublistId]={};return sublistsBuffers[sublistId];}
this.getSublistBuffer=getSublistBuffer;function getSublistCache(sublistId,lineId,useBuffer)
{var sublist=!!useBuffer?getSublistBuffer(sublistId):getSublist(sublistId);var cache=sublist[lineId]||null;if(!cache)
{cache=sublist[lineId]=recordCache.create();}
return cache;}
function fields(sublistId,lineId,useBuffer)
{var cache=getRecordCache(sublistId,lineId,useBuffer);return cache.keys();}
this.fields=fields;function migrateFromSublistToSublistBuffer(sublistId,lineId,functionToMigrate)
{var sublistBufferCache=getSublistCache(sublistId,lineId,true);var sublistCache=getSublistCache(sublistId,lineId,false);sublistCache.keys().forEach(function(cacheKey){functionToMigrate(cacheKey,sublistCache.get(cacheKey),sublistBufferCache);});}
this.migrateFromSublistToSublistBuffer=migrateFromSublistToSublistBuffer;function commitFromSublistBufferToSublist(sublistId,lineId,functionToCommit)
{var sublistCache=getSublistCache(sublistId,lineId,false);var sublistBufferCache=getSublistCache(sublistId,lineId,true);sublistBufferCache.keys().forEach(function(cacheKey){functionToCommit(cacheKey,sublistBufferCache.get(cacheKey),sublistCache);});}
this.commitFromSublistBufferToSublist=commitFromSublistBufferToSublist;return this;}
return{create:function()
{return new RecordCacheController();}}});define('N/record/modelController',['N/record/model','N/record/recordCacheController','N/utilityFunctions','N/record/recordUtilityFunctions','N/record/subrecordUtilityFunctions'],function(model,recordCacheController,utilityFunctions,recordUtil,subrecordUtil){function ModelController(options)
{var recordType=options.type;var sublistFieldStates={};var fieldObjectCache=recordCacheController.create();var userFieldCache=recordCacheController.create();var selectOptionsCache=recordCacheController.create();var subrecordCache=recordCacheController.create();var subrecordTracker={};options.subrecordCache=subrecordCache;var _model=model.create(options);(function setSublistFieldState(sublistFieldState)
{recordUtil.forEachProperty(sublistFieldState,function(sublistId,lines){sublistFieldStates[sublistId]=[];for(var line=0;line<lines.length;line++)
{sublistFieldStates[sublistId][line]={};for(var fieldId in lines[line])
{if(lines[line].hasOwnProperty(fieldId))
{var state=lines[line][fieldId];sublistFieldStates[sublistId][line][fieldId]=util.extend({},state);}}}})})(options.sublistFieldState||{});function getSublistFieldStates(sublistId,line)
{return sublistFieldStates.hasOwnProperty(sublistId)&&line>=0?sublistFieldStates[sublistId][line]:null;}
this.getSublistFieldStates=getSublistFieldStates;function hasFieldValue(fieldId){return _model.hasBodyValue(fieldId);}
this.hasFieldValue=hasFieldValue;function getSublistSelectedLineInstanceId(sublistId)
{return _model.getSublistSelectedLineInstanceId(sublistId);}
this.getSublistSelectedLineInstanceId=getSublistSelectedLineInstanceId;function isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer,allowFallback)
{return _model.isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer,allowFallback);}
this.isSublistLineInstanceIdValid=isSublistLineInstanceIdValid;function getSublistLineForInstance(sublistId,lineInstanceId,useBuffer)
{return _model.getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);}
this.getSublistLineForInstance=getSublistLineForInstance;function isSublistLineInstanceIdSelected(sublistId,lineInstanceId)
{return _model.isSublistLineInstanceIdSelected(sublistId,lineInstanceId);}
this.isSublistLineInstanceIdSelected=isSublistLineInstanceIdSelected;function setParsedValueForBodyField(fieldId,value)
{_model.setBodyValuePrimitive(fieldId,value);}
this.setParsedValueForBodyField=setParsedValueForBodyField;function setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer)
{_model.setSublistLineValuePrimitive(sublistId,lineInstanceId,fieldId,value,useBuffer);}
this.setParsedValueForSublistFieldForInstance=setParsedValueForSublistFieldForInstance;function setParsedValueForSublistField(sublistId,fieldId,line,value)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer);}
this.setParsedValueForSublistField=setParsedValueForSublistField;function setParsedValueForCurrentSublistField(sublistId,fieldId,value)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer);}
this.setParsedValueForCurrentSublistField=setParsedValueForCurrentSublistField;function setParsedValueForSublistLineBufferField(sublistId,lineInstanceId,fieldId,value)
{var useBuffer=true;setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer);}
this.setParsedValueForSublistLineBufferField=setParsedValueForSublistLineBufferField;function setFieldValue(fieldId,recordFieldValue)
{_model.setBodyValue(fieldId,recordFieldValue);}
this.setFieldValue=setFieldValue;function getFieldValue(fieldId)
{return hasFieldValue(fieldId)?_model.getBodyValue(fieldId):"";}
this.getFieldValue=getFieldValue;function getValueAsLegacyString(fieldId)
{return hasFieldValue(fieldId)?_model.getBodyValueAsLegacyString(fieldId):null;}
this.getValueAsLegacyString=getValueAsLegacyString;function getBodyFieldIds()
{return _model.getBodyFieldIds();}
this.getBodyFieldIds=getBodyFieldIds;function removeFieldValue(fieldId)
{_model.removeBodyValue(fieldId);invalidateRecordCacheForInstance(null,fieldId,null);}
this.removeFieldValue=removeFieldValue;function clearSublistData(sublistId)
{for(var line=getNextNewLineIndex_MLB(sublistId)-1;line>=0;line--)
{if(lineIndexIsNewLine_MLB(sublistId,line))
{var lineInstanceId=doGetLineInstanceId(sublistId,line,true);cancelSublistLineForInstance(sublistId,lineInstanceId);}
else
{removeSublistLine(sublistId,line);}}}
this.clearSublistData=clearSublistData;function getSublists()
{return _model.getSublists();}
this.getSublists=getSublists;function getSublistLineCount(sublistId)
{return _model.getSublistLineCount(sublistId);}
this.getSublistLineCount=getSublistLineCount;function getSublistLineCountWithAllNewLines(sublistId)
{return _model.getSublistLineCountWithAllNewLines(sublistId);}
this.getSublistLineCountWithAllNewLines=getSublistLineCountWithAllNewLines;function getSpecifiedLineInstanceIdByIndex(sublistId,index)
{return _model.getSpecifiedLineInstanceIdByIndex(sublistId,index);}
this.getSpecifiedLineInstanceIdByIndex=getSpecifiedLineInstanceIdByIndex;function getSublistLineInstanceIds(sublistId,isCommitted)
{return _model.getSublistLineInstanceIds(sublistId,isCommitted)}
this.getSublistLineInstanceIds=getSublistLineInstanceIds;function doesSublistExist(sublistId,useBuffer)
{return _model.doesSublistExist(sublistId,useBuffer);}
this.doesSublistExist=doesSublistExist;function getNewLineIndex(sublistId)
{return _model.getSublistNewLineIndex(sublistId);}
this.getNewLineIndex=getNewLineIndex;function getNextNewLineIndex_MLB(sublistId)
{return _model.getNextNewLineIndex_MLB(sublistId);}
this.getNextNewLineIndex_MLB=getNextNewLineIndex_MLB;function lineIndexIsNewLine_MLB(sublistId,line)
{return _model.lineIndexIsNewLine_MLB(sublistId,line);}
this.lineIndexIsNewLine_MLB=lineIndexIsNewLine_MLB;function updateCurrentLineToANewLine_MLB(sublistId,line)
{var useBuffer=true;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);if(!isSublistLineInstanceIdSelected(sublistId,lineInstanceId))
{var lineObj=getSublistLineForInstance(sublistId,lineInstanceId,useBuffer);_model.updateCurrentLineToANewLine_MLB(sublistId,lineObj);}
return lineInstanceId;}
this.updateCurrentLineToANewLine_MLB=updateCurrentLineToANewLine_MLB;function hasSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return _model.hasSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer);}
this.hasSublistLineValueForInstance=hasSublistLineValueForInstance;function hasSublistLineValue(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var result=hasSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);return result;}
this.hasSublistLineValue=hasSublistLineValue;function getSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return _model.getSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer);}
this.getSublistLineValueForInstance=getSublistLineValueForInstance;function getSublistLineValue(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var result=getSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);return result;}
this.getSublistLineValue=getSublistLineValue;function getSublistLineValueAsLegacyStringForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return _model.getSublistLineValueAsLegacyString(sublistId,lineInstanceId,fieldId,useBuffer);}
this.getSublistLineValueAsLegacyStringForInstance=getSublistLineValueAsLegacyStringForInstance;function getSublistLineValueAsLegacyString(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var result=getSublistLineValueAsLegacyStringForInstance(sublistId,fieldId,lineInstanceId,useBuffer);return result;}
this.getSublistLineValueAsLegacyString=getSublistLineValueAsLegacyString;function setSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,recordFieldValue,useBuffer)
{_model.setSublistLineValue(sublistId,lineInstanceId,fieldId,recordFieldValue,useBuffer);}
this.setSublistLineValueForInstance=setSublistLineValueForInstance;function setSublistLineValue(sublistId,fieldId,line,recordFieldValue)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var result=setSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,recordFieldValue,useBuffer);return result;}
this.setSublistLineValue=setSublistLineValue;function insertSublistLineForInstance(sublistId,beforeLineInstanceId,isMultilineEditable)
{var lineInstanceId=_model.insertSublistLine(sublistId,beforeLineInstanceId,isMultilineEditable);if(!!lineInstanceId)
{setupSublistSubrecordSystemId(sublistId,lineInstanceId);insertLineForRecordCacheForInstance(sublistId,lineInstanceId);}
return lineInstanceId;}
this.insertSublistLineForInstance=insertSublistLineForInstance;function insertSublistLine(sublistId,line)
{var useBuffer=false;var beforeLineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var lineInstanceId=insertSublistLineForInstance(sublistId,beforeLineInstanceId);return lineInstanceId;}
this.insertSublistLine=insertSublistLine;function updateNewLineBufferWithCopy(sublistId,lineToCopy,noCopyToDefaultMap)
{var useBuffer=true;var currentNewLineIndex=getNewLineIndex(sublistId);var currentNewLineInstanceId=getSublistLineInstanceIdForLine(sublistId,currentNewLineIndex,useBuffer);var sublistLineOptions={asBuffer:useBuffer,id:sublistId,lineInstanceId:currentNewLineInstanceId,lineIndex:currentNewLineIndex,sequence:currentNewLineIndex,toBeCloned:lineToCopy,noCopyToDefaultMap:noCopyToDefaultMap};return _model.updateNewLineBufferWithCopy(sublistLineOptions);}
this.updateNewLineBufferWithCopy=updateNewLineBufferWithCopy;function makeCopyForInstance(sublistId,lineToCopy,isMultilineEditable,noCopyToDefaultMap)
{return _model.putCopyIntoNewLineBuffer(sublistId,lineToCopy,isMultilineEditable,noCopyToDefaultMap);}
this.makeCopyForInstance=makeCopyForInstance;function setupSublistSubrecordSystemId(sublistId,lineInstanceId)
{if(_model.shouldSetupSublistSystemId(sublistId))
{var sys_id=String(-1*subrecordUtil.getNextSysId());var parent_sys_id=String(getFieldValue(subrecordUtil.SYS_ID));var useBuffer=false;setSublistLineValueForInstance(sublistId,subrecordUtil.SYS_ID,lineInstanceId,{value:sys_id,legacyStringValue:sys_id},useBuffer);setSublistLineValueForInstance(sublistId,subrecordUtil.SYS_PARENT_ID,lineInstanceId,{value:parent_sys_id,legacyStringValue:parent_sys_id},useBuffer);}}
function setupCurrentSublistSubrecordSystemId(sublistId)
{if(_model.shouldSetupSublistSystemId(sublistId))
{var sys_id=String(-1*subrecordUtil.getNextSysId());var parent_sys_id=String(getFieldValue(subrecordUtil.SYS_ID));setCurrentSublistLineValue(sublistId,subrecordUtil.SYS_ID,{value:sys_id,legacyStringValue:sys_id});setCurrentSublistLineValue(sublistId,subrecordUtil.SYS_PARENT_ID,{value:parent_sys_id,legacyStringValue:parent_sys_id});}}
function removeSublistLineForInstance(sublistId,lineInstanceId)
{var useBuffer=false;var lineExists=isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer);if(lineExists)
{_model.removeSublistLine(sublistId,lineInstanceId);removeLineForRecordCacheForInstance(sublistId,lineInstanceId);}}
this.removeSublistLineForInstance=removeSublistLineForInstance;function removeSublistLine(sublistId,line)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);removeSublistLineForInstance(sublistId,lineInstanceId);}
this.removeSublistLine=removeSublistLine;function removeSublistFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{if(isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer))
{_model.removeSublistLineValue(sublistId,lineInstanceId,fieldId,useBuffer);invalidateRecordCacheForInstance(sublistId,fieldId,lineInstanceId);}}
this.removeSublistFieldValueForInstance=removeSublistFieldValueForInstance;function removeSublistFieldValue(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);removeSublistFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.removeSublistFieldValue=removeSublistFieldValue;function getCurrentSublistFieldIds(sublistId)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);return getSublistLineFieldIds(sublistId,lineInstanceId,useBuffer);}
this.getCurrentSublistFieldIds=getCurrentSublistFieldIds;function getSublistLineFieldIds(sublistId,lineInstanceId,useBuffer)
{return _model.getSublistLineFieldIds(sublistId,lineInstanceId,useBuffer);}
this.getSublistLineFieldIds=getSublistLineFieldIds;function selectSublistLineForInstance(sublistId,lineInstanceId,isMultilineEditable)
{var resultLineInstanceId=null;var useBuffer=false;var lineInstanceExists=isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer);if(lineInstanceExists)
{resultLineInstanceId=lineInstanceId;var lineInstanceIsSelected=isSublistLineInstanceIdSelected(sublistId,lineInstanceId);if(!lineInstanceIsSelected)
{var selectedLineInstanceId=getSublistSelectedLineInstanceId(sublistId);var selectedLineIsUncommitted=!isSublistLineInstanceIdValid(sublistId,selectedLineInstanceId,useBuffer);if(selectedLineIsUncommitted&&!isMultilineEditable)
{removeLineForRecordCacheForInstance(sublistId,selectedLineInstanceId);}
invalidateCurrentSublistRecordCache(sublistId);_model.selectSublistLine(sublistId,lineInstanceId,isMultilineEditable);}}
return resultLineInstanceId;}
this.selectSublistLineForInstance=selectSublistLineForInstance;function selectSublistLine(sublistId,line,isMultilineEditable)
{var lineInstanceId=getSpecifiedLineInstanceIdByIndex(sublistId,line);lineInstanceId=selectSublistLineForInstance(sublistId,lineInstanceId,isMultilineEditable);return lineInstanceId;}
this.selectSublistLine=selectSublistLine;function selectNewSublistLine(sublistId,defaultValues)
{var lineInstanceId=_model.getSublistSelectedLineInstanceId(sublistId);if(getCurrentSublistLineIndex(sublistId)!=getNewLineIndex(sublistId))
{lineInstanceId=_model.selectNewSublistLine(sublistId,defaultValues);setupCurrentSublistSubrecordSystemId(sublistId);}
return lineInstanceId;}
this.selectNewSublistLine=selectNewSublistLine;function addNewSublistLine(sublistId,defaultValues)
{var lineInstanceId=_model.addNewSublistLine(sublistId,defaultValues);setupCurrentSublistSubrecordSystemId(sublistId);return lineInstanceId}
this.addNewSublistLine=addNewSublistLine;function cancelSublistLineForInstance(sublistId,lineInstanceId)
{invalidateSublistRecordCacheForInstance(sublistId,lineInstanceId);_model.cancelSublistLine(sublistId,lineInstanceId);}
this.cancelSublistLineForInstance=cancelSublistLineForInstance;function cancelCurrentSublistLine(sublistId)
{var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);cancelSublistLineForInstance(sublistId,lineInstanceId);}
this.cancelCurrentSublistLine=cancelCurrentSublistLine;function resetSublistLineForInstance(sublistId,lineInstanceId,defaultValues,useBuffer)
{if(useBuffer)
{invalidateSublistRecordCacheForInstance(sublistId,lineInstanceId);}
_model.resetSublistLine(sublistId,lineInstanceId,defaultValues);}
this.resetSublistLineForInstance=resetSublistLineForInstance;function resetSublistLine(sublistId,line,defaultValues)
{var useBuffer=false;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);if(!!lineInstanceId)
{resetSublistLineForInstance(sublistId,lineInstanceId,defaultValues,useBuffer);}}
this.resetSublistLine=resetSublistLine;function runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,func,thisArg,argList)
{argList=argList||[];if(util.isFunction(func)&&util.isArray(argList))
{_model.runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,func,thisArg,argList);}}
this.runFunctionWhileSilentlySelectingLine=runFunctionWhileSilentlySelectingLine;function getCurrentSublistLineIndex(sublistId)
{return _model.getSublistSelectedLineIndex(sublistId);}
this.getCurrentSublistLineIndex=getCurrentSublistLineIndex;function getSublistLineInstanceIdForLine(sublistId,line,useBuffer)
{return _model.getSublistLineInstanceIdForIndex(sublistId,line,useBuffer);}
this.getSublistLineInstanceIdForLine=getSublistLineInstanceIdForLine;function getSublistLineInstanceIdForLineWithFallback(sublistId,line,useBuffer)
{var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);if(useBuffer&&!lineInstanceId)
lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,!useBuffer);return lineInstanceId||null;}
function getCurrentSublistLineValue(sublistId,fieldId)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);return getSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getCurrentSublistLineValue=getCurrentSublistLineValue;function getSublistLineBufferValueForInstance(sublistId,lineInstanceId,fieldId)
{var useBuffer=true;return getSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getSublistLineBufferValueForInstance=getSublistLineBufferValueForInstance;function getCurrentSublistLineValueAsLegacyString(sublistId,fieldId)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);return _model.getSublistLineValueAsLegacyString(sublistId,lineInstanceId,fieldId,useBuffer);}
this.getCurrentSublistLineValueAsLegacyString=getCurrentSublistLineValueAsLegacyString;function setCurrentSublistLineValue(sublistId,fieldId,recordFieldValue)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);setSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,recordFieldValue,useBuffer);}
this.setCurrentSublistLineValue=setCurrentSublistLineValue;function setSublistLineBufferValueForInstance(sublistId,lineInstanceId,fieldId,recordFieldValue)
{var useBuffer=true;setSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,recordFieldValue,useBuffer);}
this.setSublistLineBufferValueForInstance=setSublistLineBufferValueForInstance;function hasCurrentSublistLineValue(sublistId,fieldId)
{var useBuffer=true;var lineInstanceId=getSublistSelectedLineInstanceId(sublistId);return hasSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.hasCurrentSublistLineValue=hasCurrentSublistLineValue;function commitSublistLineForInstance(sublistId,lineInstanceId)
{var useBuffer=false;var lineInstanceIdIsUncommitted=!isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer);if(lineInstanceIdIsUncommitted)
{insertLineForRecordCacheForInstance(sublistId,lineInstanceId);}
_model.commitSublistLine(sublistId,lineInstanceId);handleRecordCacheWhileCommittingLine(sublistId,lineInstanceId);}
this.commitSublistLineForInstance=commitSublistLineForInstance;function commitSublistLine(sublistId,line)
{var useBuffer=true;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,line,useBuffer);commitSublistLineForInstance(sublistId,lineInstanceId);}
this.commitSublistLine=commitSublistLine;function handleRecordCacheWhileCommittingLine(sublistId,lineInstanceId)
{handleFieldWhileCommittingLine(sublistId,lineInstanceId);handleSubrecordsWhileCommittingLine(sublistId,lineInstanceId);}
function handleFieldWhileCommittingLine(sublistId,lineInstanceId)
{fieldObjectCache.commitFromSublistBufferToSublist(sublistId,lineInstanceId,function(fieldId,entryToBeCommitted,sublistCache){sublistCache.put(fieldId,entryToBeCommitted);fieldObjectCache.invalidate(sublistId,fieldId,lineInstanceId,true);});userFieldCache.commitFromSublistBufferToSublist(sublistId,lineInstanceId,function(fieldId,entryToBeCommitted,sublistCache){sublistCache.put(fieldId,entryToBeCommitted);userFieldCache.invalidate(sublistId,fieldId,lineInstanceId,true);});}
function handleSubrecordsWhileCommittingLine(sublistId,lineInstanceId)
{subrecordCache.commitFromSublistBufferToSublist(sublistId,lineInstanceId,function(fieldId,entryToBeCommitted,sublistCache){var subrecord=entryToBeCommitted.current;var useBuffer=false;doSetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord);useBuffer=true;subrecordCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);});}
function insertLineForRecordCacheForInstance(sublistId,lineInstanceId)
{var useBuffer=false;userFieldCache.get(sublistId,null,lineInstanceId,useBuffer);fieldObjectCache.get(sublistId,null,lineInstanceId,useBuffer);selectOptionsCache.get(sublistId,null,lineInstanceId,useBuffer);subrecordCache.get(sublistId,null,lineInstanceId,useBuffer);}
function removeLineForRecordCacheForInstance(sublistId,lineInstanceId)
{var useBuffer=false;userFieldCache.invalidate(sublistId,null,lineInstanceId,useBuffer);fieldObjectCache.invalidate(sublistId,null,lineInstanceId,useBuffer);selectOptionsCache.invalidate(sublistId,null,lineInstanceId,useBuffer);subrecordCache.invalidate(sublistId,null,lineInstanceId,useBuffer);}
function invalidateRecordCacheForInstance(sublistId,fieldId,lineInstanceId)
{var useBuffer=false;userFieldCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);fieldObjectCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);selectOptionsCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);subrecordCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);}
function flushBufferCacheForFieldStateUpdate(sublistId,fieldId,lineInstanceId)
{var useBuffer=true;userFieldCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);fieldObjectCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);}
this.flushBufferCacheForFieldStateUpdate=flushBufferCacheForFieldStateUpdate;function invalidateSublistRecordCacheForInstance(sublistId,lineInstanceId)
{var useBuffer=true;fieldObjectCache.invalidate(sublistId,null,lineInstanceId,useBuffer);selectOptionsCache.invalidate(sublistId,null,lineInstanceId,useBuffer);if(isSublistLineInstanceIdSelected(sublistId,lineInstanceId))
{setCurrentSublistSubrecordCaheEntrysDereferenced(sublistId);}
subrecordCache.invalidate(sublistId,null,lineInstanceId,useBuffer);}
function invalidateCurrentSublistRecordCache(sublistId)
{var useBuffer=true;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,getCurrentSublistLineIndex(sublistId),useBuffer);invalidateSublistRecordCacheForInstance(sublistId,lineInstanceId);}
function shouldUseBuffer(line,useBuffer)
{return(line===-1)||useBuffer;}
function doGetLineInstanceId(sublistId,line,useBuffer)
{var useThisLine=(line===-1)?getCurrentSublistLineIndex(sublistId):line;return getSublistLineInstanceIdForLine(sublistId,useThisLine,shouldUseBuffer(line,useBuffer));}
function getSelectOptionCache()
{return selectOptionsCache;}
this.getSelectOptionCache=getSelectOptionCache;function cacheSelectOptionsForInstance(sublistId,fieldId,lineInstanceId,options,useBuffer)
{selectOptionsCache.put(sublistId,fieldId,lineInstanceId,options,useBuffer);}
this.cacheSelectOptionsForInstance=cacheSelectOptionsForInstance;function cacheSelectOptions(sublistId,fieldId,line,options,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);cacheSelectOptionsForInstance(sublistId,fieldId,lineInstanceId,options,useBuffer);}
this.cacheSelectOptions=cacheSelectOptions;function getSelectOptionsForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return selectOptionsCache.get(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getSelectOptionsForInstance=getSelectOptionsForInstance;function getSelectOptions(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return getSelectOptionsForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getSelectOptions=getSelectOptions;function cacheRecordFieldForInstance(sublistId,fieldId,lineInstanceId,field,useBuffer)
{fieldObjectCache.put(sublistId,fieldId,lineInstanceId,field,useBuffer);}
this.cacheRecordFieldForInstance=cacheRecordFieldForInstance;function cacheRecordField(sublistId,fieldId,line,field,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);cacheRecordFieldForInstance(sublistId,fieldId,lineInstanceId,field,useBuffer);}
this.cacheRecordField=cacheRecordField;function getRecordfieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return fieldObjectCache.get(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getRecordfieldForInstance=getRecordfieldForInstance;function getRecordfield(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return getRecordfieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getRecordfield=getRecordfield;function cacheUserFieldForInstance(sublistId,fieldId,lineInstanceId,field,useBuffer)
{userFieldCache.put(sublistId,fieldId,lineInstanceId,field,useBuffer);}
this.cacheUserFieldForInstance=cacheUserFieldForInstance;function cacheUserField(sublistId,fieldId,line,field,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);cacheUserFieldForInstance(sublistId,fieldId,lineInstanceId,field,useBuffer);}
this.cacheUserField=cacheUserField;function getUserFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return userFieldCache.get(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getUserFieldForInstance=getUserFieldForInstance;function getUserField(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return getUserFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getUserField=getUserField;function hasUserFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return userFieldCache.has(sublistId,fieldId,lineInstanceId,useBuffer);}
this.hasUserFieldForInstance=hasUserFieldForInstance;function hasUserField(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return hasUserFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.hasUserField=hasUserField;function doCacheSubrecordForInstance(sublistId,fieldId,lineInstanceId,subrecordObj,useBuffer)
{subrecordCache.put(sublistId,fieldId,lineInstanceId,subrecordObj,useBuffer);}
function doCacheSubrecord(sublistId,fieldId,line,subrecordObj,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);doCacheSubrecordForInstance(sublistId,fieldId,lineInstanceId,subrecordObj,useBuffer);}
function doGetCachedSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return subrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);}
function doGetCachedSubrecord(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return doGetCachedSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function _doHasValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return recordUtil.executeRecordGetterFunctionsForInstance(sublistId,fieldId,lineInstanceId,useBuffer,hasFieldValue,hasSublistLineValueForInstance);}
function _doHasValue(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return _doHasValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function _doGetValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return recordUtil.executeRecordGetterFunctionsForInstance(sublistId,fieldId,lineInstanceId,useBuffer,getFieldValue,getSublistLineValueForInstance);}
function _doGetValue(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return _doGetValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function doHasSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var cachedSubrecord=doGetCachedSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);var hasSubrecord=!!cachedSubrecord&&cachedSubrecord.current!==null;if(!hasSubrecord&&_doHasValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer))
{hasSubrecord=!!_doGetValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
return hasSubrecord;}
function doHasSubrecord(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return doHasSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function doGetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var cachedSubrecord=doGetCachedSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);return!!cachedSubrecord?cachedSubrecord.current:null;}
this.doGetSubrecordForInstance=doGetSubrecordForInstance;function doGetSubrecord(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return doGetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function doSetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord)
{var cachedEntry=doGetCachedSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);if(!cachedEntry)
{cachedEntry={};var existingSubrecordId=parseInt(_doGetValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer));var isValidRecordId=!isNaN(existingSubrecordId);if(isValidRecordId)
{var hasExistingSubrecord=!!subrecord&&subrecord.id===existingSubrecordId;if(hasExistingSubrecord)
cachedEntry.initial=subrecord;else
cachedEntry.initial=createSubrecordReference(existingSubrecordId);}
doCacheSubrecordForInstance(sublistId,fieldId,lineInstanceId,cachedEntry,useBuffer);}
cachedEntry.current=subrecord;if(!!subrecord)
{var subrecordSystemId=subrecord.doGetValue(subrecordUtil.SYS_ID);if(!subrecordSystemId||subrecordSystemId==="0")
{var sys_id=String(subrecordUtil.getNextSysId()*(cachedEntry.initial===subrecord?1:-1));subrecord.doSetValue(subrecordUtil.SYS_ID,sys_id);updateDependentSysIds();}
if(!subrecord.doGetValue(subrecordUtil.SYS_PARENT_ID))
{var systemParentId=String(_doGetValueForInstance(sublistId,subrecordUtil.SYS_ID,lineInstanceId,useBuffer));subrecord.doSetValue(subrecordUtil.SYS_PARENT_ID,systemParentId);}}
var isCurrentSublistSubrecord=useBuffer&&isSublistLineInstanceIdSelected(sublistId,lineInstanceId);if(!isCurrentSublistSubrecord)
{var parentSystemId=getParentSystemIdForInstance(sublistId,lineInstanceId);subrecordTracker[parentSystemId]=subrecordTracker[parentSystemId]||{};subrecordTracker[parentSystemId][fieldId]={isDeleted:!subrecord};}}
function doSetSubrecord(sublistId,fieldId,line,subrecord,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);doSetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord);}
function hasNewlyCommittedSublistSubrecord(systemId,fieldId)
{return subrecordTracker.hasOwnProperty(systemId)&&subrecordTracker[systemId][fieldId]&&!subrecordTracker[systemId][fieldId].isDeleted;}
this.hasNewlyCommittedSublistSubrecord=hasNewlyCommittedSublistSubrecord;function getParentSystemIdForInstance(sublistId,lineInstanceId,useBuffer)
{var sys_parent_id=!!sublistId?getSublistSystemIdForInstance(sublistId,lineInstanceId,useBuffer):getSystemId();return sys_parent_id;}
this.getParentSystemIdForInstance=getParentSystemIdForInstance;function getParentSystemId(sublistId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return getParentSystemIdForInstance(sublistId,lineInstanceId,useBuffer);}
this.getParentSystemId=getParentSystemId;function getSystemId()
{return getFieldValue(subrecordUtil.SYS_ID);}
this.getSystemId=getSystemId;function getSublistSystemIdForInstance(sublistId,lineInstanceId,useBuffer)
{return getSublistLineValueForInstance(sublistId,subrecordUtil.SYS_ID,lineInstanceId,useBuffer);}
this.getSublistSystemIdForInstance=getSublistSystemIdForInstance;function getSublistSystemId(sublistId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return getSublistSystemIdForInstance(sublistId,lineInstanceId,useBuffer);}
this.getSublistSystemId=getSublistSystemId;function getCurrentSublistSystemId(sublistId)
{return getCurrentSublistLineValue(sublistId,subrecordUtil.SYS_ID);}
this.getCurrentSublistSystemId=getCurrentSublistSystemId;function createSubrecordReference(id)
{var data={},result={};data[subrecordUtil.SYS_ID]=subrecordUtil.getNextSysId();data[subrecordUtil.SYS_PARENT_ID]=getParentSystemId(subrecordUtil.SYS_ID);data.id=String(id);result.id=parseInt(data.id,10);result.getFields=function(){return Object.keys(data);};function fetchValue(fieldId){return data[fieldId];}
function fetchValueAsString(fieldId)
{var returnMe=data[fieldId];return utilityFunctions.isValEmpty(returnMe)?null:String(returnMe);}
result.getValue=fetchValue;result.doGetValue=fetchValue;result.getFieldValue=fetchValue;result.getValueAsLegacyString=fetchValueAsString;return result;}
function updateDependentSysIds()
{}
function hasSubrecord(fieldId)
{var useBuffer=false;return doHasSubrecord(null,fieldId,-1,useBuffer);}
this.hasSubrecord=hasSubrecord;function getSubrecord(fieldId)
{var useBuffer=false;return doGetSubrecord(null,fieldId,-1,useBuffer);}
this.getSubrecord=getSubrecord;function cacheSubrecord(fieldId,subrecord)
{var useBuffer=false;return doSetSubrecord(null,fieldId,-1,subrecord,useBuffer);}
this.cacheSubrecord=cacheSubrecord;function hasSublistSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return doHasSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.hasSublistSubrecordForInstance=hasSublistSubrecordForInstance;function hasSublistSubrecord(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return hasSublistSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.hasSublistSubrecord=hasSublistSubrecord;function getSublistSubrecord(sublistId,fieldId,line,useBuffer)
{return doGetSubrecord(sublistId,fieldId,line,useBuffer);}
this.getSublistSubrecord=getSublistSubrecord;function cacheSublistSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord)
{return doSetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord);}
this.cacheSublistSubrecordForInstance=cacheSublistSubrecordForInstance;function clearSubrecordCacheForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{return doSetSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,null);}
this.clearSubrecordCacheForInstance=clearSubrecordCacheForInstance;function cacheSublistSubrecord(sublistId,fieldId,line,subrecord,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);return cacheSublistSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer,subrecord);}
this.cacheSublistSubrecord=cacheSublistSubrecord;function hasCurrentSublistSubrecord(sublistId,fieldId)
{var useBuffer=true;return doHasSubrecord(sublistId,fieldId,-1,useBuffer);}
this.hasCurrentSublistSubrecord=hasCurrentSublistSubrecord;function getCurrentSublistSubrecord(sublistId,fieldId)
{var useBuffer=true;return doGetSubrecord(sublistId,fieldId,-1,useBuffer);}
this.getCurrentSublistSubrecord=getCurrentSublistSubrecord;function setCurrentSublistSubrecord(sublistId,fieldId,subrecord)
{var useBuffer=true;return doSetSubrecord(sublistId,fieldId,-1,subrecord,useBuffer);}
this.setCurrentSublistSubrecord=setCurrentSublistSubrecord;function getData()
{return _model.getData();}
this.getData=getData;function getSublistData()
{return _model.getSublistData();}
this.getSublistData=getSublistData;function getSubrecordDataForSubmission()
{return _model.getSubrecordDataForSubmission();}
this.getSubrecordDataForSubmission=getSubrecordDataForSubmission;function clone()
{return new ModelController({type:options.type,sublistFieldState:options.sublistFieldState,data:_model.getClonedData()});}
this.clone=clone;function validateCurrentSublistSubrecords(sublistId)
{var useBuffer=true;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,getCurrentSublistLineIndex(sublistId),useBuffer);validateCurrentSublistSubrecordsForInstance(sublistId,lineInstanceId);}
this.validateCurrentSublistSubrecords=validateCurrentSublistSubrecords;function validateCurrentSublistSubrecordsForInstance(sublistId,lineInstanceId)
{var useBuffer=true;var fields=subrecordCache.fields(sublistId,lineInstanceId,useBuffer);fields.forEach(function(fieldId){var entry=subrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);var subrecord=entry?entry.current:null;if(subrecord!=null&&!subrecord.isValidated())
{subrecord.validate();subrecord.setDereferencedFromParent(true);}})}
this.validateCurrentSublistSubrecordsForInstance=validateCurrentSublistSubrecordsForInstance;function setSubrecordCacheEntryDereferencedForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var entry=subrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);var subrecord=entry?entry.current:null;if(subrecord!=null)
{subrecord.setDereferencedFromParent(true);}}
function setSubrecordCacheEntryDereferenced(sublistId,fieldId,line,useBuffer)
{useBuffer=shouldUseBuffer(line,useBuffer);var lineInstanceId=doGetLineInstanceId(sublistId,line,useBuffer);setSubrecordCacheEntryDereferencedForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function setCurrentSublistSubrecordCaheEntrysDereferenced(sublistId)
{var useBuffer=true;var lineInstanceId=getSublistLineInstanceIdForLine(sublistId,getCurrentSublistLineIndex(sublistId),useBuffer);var fields=subrecordCache.fields(sublistId,lineInstanceId,useBuffer);fields.forEach(function(fieldId){var entry=subrecordCache.get(sublistId,fieldId);var subrecord=entry?entry.current:null;if(subrecord!=null)
{subrecord.setDereferencedFromParent(true);}});}
function getSublistLineJSON(sublistId,lineInstanceId,useBuffer)
{return _model.getSublistLineJSON(sublistId,lineInstanceId,useBuffer);}
this.getSublistLineJSON=getSublistLineJSON;function getSelectOptionTextFromCache(sublistId,fieldId,value)
{return _model.getSelectOptionTextFromCache(sublistId,fieldId,value)}
this.getSelectOptionTextFromCache=getSelectOptionTextFromCache;function cacheSelectOptionText(sublistId,fieldId,value,text)
{_model.cacheSelectOptionText(sublistId,fieldId,value,text);}
this.cacheSelectOptionText=cacheSelectOptionText;function on(options)
{_model.on(options);}
this.on=on;function off(options)
{_model.off(options);}
this.off=off;return this;}
return{create:function create(options){return new ModelController(options);},isInstance:function(obj){return obj instanceof ModelController;}};});define('N/record/dynamicRecordImpl',['N/record/recordUtilityFunctions','N/utilityFunctions','N/util/validator'],function(recordUtil,utilityFunctions,validator)
{function DynamicRecordImpl(record)
{var that=this;var undef=undefined;var recordScriptingScope;function initRecord(record,scope)
{recordScriptingScope=scope;recordScriptingScope.pageInit();}
this.initRecord=initRecord;function isDynamic(){return true;}
this.isDynamic=isDynamic;this.validateTextApi=recordUtil.no_op_function;function getLineInstanceId(sublistId,line,useBuffer)
{return record.getModelController().getSublistLineInstanceIdForLine(sublistId,line,useBuffer);}
this.getLineInstanceId=getLineInstanceId;function shouldValidateFieldPermissions()
{return 'T'===record.getRecordRequestContext().enablefieldpermissions&&!record.isInternal();}
this.shouldValidateFieldPermissions=shouldValidateFieldPermissions;function validateLineIndex(lineNumberIndex,lowerBoundInclusive,upperBoundExclusive)
{lineNumberIndex=parseInt(lineNumberIndex,10);recordUtil.assertValidSublistOperation(lowerBoundInclusive<=lineNumberIndex&&lineNumberIndex<upperBoundExclusive)}
this.validateLineIndex=validateLineIndex;function getCachedOptionsForRecordField(sublistId,fieldId,line)
{return record.getModelController().getSelectOptions(sublistId,fieldId,line);}
this.getCachedOptionsForRecordField=getCachedOptionsForRecordField;function doGetText(fieldId,delegator)
{return delegator.getTextValue(fieldId);}
this.doGetText=doGetText;function getParsedValueForBodyField(fieldId,delegator)
{return delegator.getParsedValue(fieldId);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function doSetValue(fieldId,value,fireFieldChange,noSlaving)
{value=recordUtil.emptyIfNullOrUndefined(value);if(record.isFieldMultiSelect(undef,fieldId))
value=recordUtil.formatValueToArrayType(value);else if(record.isFieldRadio(undef,fieldId))
value=String(value);var validatedValue=record.validateAndFormatFieldValue(undef,fieldId,value);record.doSetFieldValue(fieldId,validatedValue,fireFieldChange,noSlaving);}
this.doSetValue=doSetValue;function doSetText(fieldId,text,fireFieldChange,noSlaving,isUpdatingSlaveField)
{var value,recordField;var useBuffer=false;noSlaving=!!noSlaving;isUpdatingSlaveField=!!isUpdatingSlaveField;if(record.isFieldMultiSelect(undef,fieldId))
{var texts=recordUtil.formatValueToArrayType(text);record.doSetTexts(fieldId,texts,fireFieldChange,noSlaving);}
else if(record.isFieldSelectType(undef,fieldId))
{value="";var unwrappedText=recordUtil.formatArrayToStringType(text);if(unwrappedText||unwrappedText==="")
{recordField=record.getCachedRecordField(undef,fieldId,-1,useBuffer);value=recordField.validateSelectFieldByText(text);}
record.doSetFieldValue(fieldId,value,fireFieldChange,noSlaving,true,isUpdatingSlaveField);}
else if(record.isFieldRadio(undef,fieldId))
{var fieldLevelMetadata=record.getFieldLevelMetadataForBodyField(fieldId);value=validator.validateRadioFieldByText(fieldId,text,fieldLevelMetadata.radioSet);record.doSetFieldValue(fieldId,value,fireFieldChange,noSlaving,true,isUpdatingSlaveField);}
else
{if(record.isFieldCheckbox(undef,fieldId))
validator.validateCheckBoxField(fieldId,text);var fieldLevelMetadata=record.getFieldLevelMetadataForBodyField(fieldId);value=record.parseValue(record.isValidBodyField(fieldId),fieldLevelMetadata,text);record.doSetValue(fieldId,value,fireFieldChange,noSlaving);}
record.getFieldState(fieldId).useTextApi=true;}
this.doSetText=doSetText;function validateAndFormatFieldValue(sublistId,fieldId,value)
{var useBuffer=(!!sublistId);var lineInstanceId=(!!sublistId)?record.getModelController().getSublistSelectedLineInstanceId(sublistId):null;return validateAndFormatFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,value);}
this.validateAndFormatFieldValue=validateAndFormatFieldValue;function validateAndFormatFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,value,isInteractive)
{var validatedValue=value;var toValidate=record.shouldValidateField()&&record.isValidField(sublistId,fieldId);if(toValidate)
{var field=record.getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);validatedValue=field.validateAndFormatFieldValue(value,isInteractive);}
return validatedValue;}
this.validateAndFormatFieldValueForInstance=validateAndFormatFieldValueForInstance;function doGetParsedSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator)
{return delegator.getParsedValue(fieldId);}
this.doGetParsedSublistValueForInstance=doGetParsedSublistValueForInstance;this.setSublistValue=recordUtil.no_op_function;function doGetSublistTextForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator)
{return delegator.getTextValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.doGetSublistTextForInstance=doGetSublistTextForInstance;this.setSublistText=recordUtil.no_op_function;function preInsertLine(sublistId,line)
{var lineObj;if(!record.isMultilineEditable(sublistId)&&record.doGetCurrentSublistIndex(sublistId)!==line&&line<=record.doGetLineCount(sublistId)-1)
lineObj=record.doSelectLine(sublistId,line);record.triggerValidateInsertScript(sublistId);return lineObj;}
this.preInsertLine=preInsertLine;function preInsertLineForInstance(sublistId,beforeLineInstanceId)
{record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,beforeLineInstanceId,record.triggerValidateInsertScript,that,[sublistId]);}
this.preInsertLineForInstance=preInsertLineForInstance;function postInsertLine(sublistId,line,ignoreRecalc)
{var lineObj;if(!ignoreRecalc)
record.triggerRecalcScript(sublistId,false,'insert');record.doResetSublistLine(sublistId,line,record.getMetadata().getSublistDefaultValue(sublistId));if(!record.isMultilineEditable(sublistId))
{lineObj=record.doSelectLine(sublistId,line);}
return lineObj;}
this.postInsertLine=postInsertLine;function postInsertLineForInstance(sublistId,lineInstanceId,ignoreRecalc)
{var lineObj;if(!ignoreRecalc)
record.triggerRecalcScript(sublistId,false,'insert');record.doResetSublistLineForInstance(sublistId,lineInstanceId,record.getMetadata().getSublistDefaultValue(sublistId));if(!record.isMultilineEditable(sublistId))
{lineObj=record.doSelectLineForInstance(sublistId,lineInstanceId);}
return lineObj;}
this.postInsertLineForInstance=postInsertLineForInstance;function removeSublistLine(sublistId,line,ignoreRecalc)
{var lineObj;if(record.doGetCurrentSublistIndex(sublistId)!==line)
lineObj=record.doSelectLine(sublistId,line);record.triggerValidateDeleteScript(sublistId);record.doRemoveSublistLine(sublistId,line);if(!ignoreRecalc)
record.triggerRecalcScript(sublistId,false,'remove');return lineObj;}
this.removeSublistLine=removeSublistLine;function doRemoveSublistLine(sublistId,lineInstanceId,ignoreRecalc)
{record.triggerValidateDeleteScript(sublistId);record.doRemoveSublistLineForInstance(sublistId,lineInstanceId);if(!ignoreRecalc)
record.triggerRecalcScript(sublistId,false,'remove');}
function removeSublistLineForInstance(sublistId,lineInstanceId,ignoreRecalc)
{record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,doRemoveSublistLine,that,[sublistId,lineInstanceId,ignoreRecalc]);}
this.removeSublistLineForInstance=removeSublistLineForInstance;function postRemoveLine(sublistId,line,isLastLine,isMultilineEditable)
{var lineObj=null;record.postDeleteLine(sublistId,line);if(!isMultilineEditable)
{if(isLastLine)
lineObj=record.doSelectNewLine(sublistId);else if(line<=record.doGetLineCount(sublistId))
lineObj=record.doSelectLine(sublistId,line);}
return lineObj;}
this.postRemoveLine=postRemoveLine;function postRemoveLineForInstance(sublistId,lineInstanceId,useBuffer)
{record.postDeleteLineForInstance(sublistId,lineInstanceId,useBuffer)}
this.postRemoveLineForInstance=postRemoveLineForInstance;function addNewLine(options)
{var sublistId=recordUtil.handleOverloadingMethodsForSingleArgument(options,'sublistId',record.getMissingArgumentErrorMessageFillerValue("addLine"));recordUtil.assertValidSublistOperation(record.isSublistAnEditMachine(sublistId));return record.doAddNewLine(sublistId);}
this.addNewLine=addNewLine;function selectLine(options,line)
{var sublistId,lineInstanceId,lineObj;if(line!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;line=options.line;lineInstanceId=options.lineInstanceId;utilityFunctions.checkMutuallyExclusiveArguments(line,lineInstanceId,'line','lineInstanceId');}
if(line!=undef)
{utilityFunctions.checkArgs([sublistId,line],['sublistId','line'],record.getMissingArgumentErrorMessageFillerValue("selectLine"));lineObj=record.doSelectLine(sublistId,line);}
else
{utilityFunctions.checkArgs([sublistId,lineInstanceId],['sublistId','lineInstanceId'],record.getMissingArgumentErrorMessageFillerValue('selectLine'));lineObj=record.doSelectLineForInstance(sublistId,lineInstanceId);}
return lineObj;}
this.selectLine=selectLine;function selectNewLine(options)
{var sublistId=recordUtil.handleOverloadingMethodsForSingleArgument(options,'sublistId',record.getMissingArgumentErrorMessageFillerValue("selectNewLine"));recordUtil.assertValidSublistOperation(record.isSublistAnEditMachine(sublistId));return record.doSelectNewLine(sublistId);}
this.selectNewLine=selectNewLine;function cancelLine(options)
{var sublistId=recordUtil.handleOverloadingMethodsForSingleArgument(options,'sublistId',record.getMissingArgumentErrorMessageFillerValue("cancelLine"));recordUtil.assertValidSublistOperation(record.isSublistAnEditMachine(sublistId));record.doCancelLine(sublistId);}
this.cancelLine=cancelLine;function cancelLineForInstance(sublistId,lineInstanceId)
{recordUtil.assertValidSublistOperation(record.isSublistAnEditMachine(sublistId));record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,record.doCancelLineForInstance,that,[sublistId,lineInstanceId]);}
this.cancelLineForInstance=cancelLineForInstance;function commitLine(options)
{var sublistId=recordUtil.handleOverloadingMethodsForSingleArgument(options,'sublistId',record.getMissingArgumentErrorMessageFillerValue("commitLine"));var ignoreRecalc=options!==undef&&options!==null&&options.hasOwnProperty('ignoreRecalc')?options.ignoreRecalc:false;recordUtil.assertValidSublistOperation(record.isSublistEditable(sublistId));record.doCommitLine(sublistId,ignoreRecalc);}
this.commitLine=commitLine;function commitLineForInstance(sublistId,lineInstanceId)
{recordUtil.assertValidSublistOperation(record.isSublistAnEditMachine(sublistId));var ignoreRecalc=false;record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,record.doCommitLineForInstance,that,[sublistId,lineInstanceId,ignoreRecalc]);}
this.commitLineForInstance=commitLineForInstance;function getCurrentSublistValue(options,fieldId,delegator)
{var sublistId;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],record.getMissingArgumentErrorMessageFillerValue("getCurrentSublistValue"));var lineInstanceId=record.getModelController().getSublistSelectedLineInstanceId(sublistId);var lineDefinitionObject=record.getLineObjectFromCache(sublistId,lineInstanceId,true);return lineDefinitionObject.getParsedValueForBodyField(fieldId);}
this.getCurrentSublistValue=getCurrentSublistValue;function setCurrentSublistValue(options,fieldId,value,isInteractive)
{var sublistId,fireFieldChange=true,noSlaving=false;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;value=options.value;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;noSlaving=util.isBoolean(options.noslaving)?options.noslaving:noSlaving;isInteractive=util.isBoolean(options.isInteractive)?options.isInteractive:false;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],record.getMissingArgumentErrorMessageFillerValue("setCurrentSublistValue"));recordUtil.validateAgainstSqlInjection(fieldId,value);record.doSetCurrentSublistValue(sublistId,fieldId,value,fireFieldChange,noSlaving,isInteractive);}
this.setCurrentSublistValue=setCurrentSublistValue;function setSublistBufferValue(options)
{var sublistId=options.sublistId,fieldId=options.fieldId,lineInstanceId=options.lineInstanceId,value=options.value,fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:true,noSlaving=util.isBoolean(options.noslaving)?options.noslaving:false;utilityFunctions.checkArgs([sublistId,fieldId,lineInstanceId],['sublistId','fieldId','lineInstanceId'],record.getMissingArgumentErrorMessageFillerValue("setSublistBufferValue"));recordUtil.validateAgainstSqlInjection(fieldId,value);record.doSetSublistBufferValue(sublistId,fieldId,lineInstanceId,value,fireFieldChange,noSlaving);}
this.setSublistBufferValue=setSublistBufferValue;function getCurrentSublistText(options,fieldId)
{var sublistId;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],record.getMissingArgumentErrorMessageFillerValue("getCurrentSublistText"));var lineInstanceId=record.getModelController().getSublistSelectedLineInstanceId(sublistId);var lineDefinitionObject=record.getLineObjectFromCache(sublistId,lineInstanceId,true);return lineDefinitionObject.doGetText(fieldId);}
this.getCurrentSublistText=getCurrentSublistText;function setCurrentSublistText(options,fieldId,text,isInteractive)
{var sublistId,fireFieldChange=true,noSlaving=false;if(fieldId!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;text=options.text;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;noSlaving=util.isBoolean(options.noslaving)?options.noslaving:noSlaving;isInteractive=util.isBoolean(options.isInteractive)?options.isInteractive:false;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],record.getMissingArgumentErrorMessageFillerValue("setCurrentSublistText"));recordUtil.validateAgainstSqlInjection(fieldId,text);record.doSetCurrentSublistText(sublistId,fieldId,text,fireFieldChange,noSlaving,false,isInteractive);}
this.setCurrentSublistText=setCurrentSublistText;function postSetFieldValue(sublistId,fieldId,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField)
{var internalFieldChangeScriptFieldId='nlapiFC';if(fireFieldChange===undef)
fireFieldChange=true;if(noSlaving===undef)
noSlaving=false;var nlapiFCValue=null;if(!fireFieldChange&&!utilityFunctions.isValEmpty(record.doGetValue(internalFieldChangeScriptFieldId))&&!record.isInternal())
{fireFieldChange=true;nlapiFCValue=record.getModelController().getFieldValue(internalFieldChangeScriptFieldId);record.getModelController().setFieldValue(internalFieldChangeScriptFieldId,{value:'',legacyStringValue:''});}
if(fireFieldChange)
{var line=record.isSublistAListMachine(sublistId)?recordUtil.getOneBasedIndex(record.doGetCurrentSublistIndex(sublistId)):-1;if(!isUpdatingSlavingField)
record.triggerValidateFieldScript(sublistId,fieldId,line);record.triggerFieldChangeEvent(sublistId,fieldId,line,dbValue,noSlaving);}
if(!nlapiFCValue)
record.getModelController().setFieldValue(internalFieldChangeScriptFieldId,{value:nlapiFCValue,legacyStringValue:nlapiFCValue});}
this.postSetFieldValue=postSetFieldValue;function postSetFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField)
{var internalFieldChangeScriptFieldId='nlapiFC';if(fireFieldChange===undef)
fireFieldChange=true;if(noSlaving===undef)
noSlaving=false;var nlapiFCValue=null;if(!fireFieldChange&&!utilityFunctions.isValEmpty(record.doGetValue(internalFieldChangeScriptFieldId))&&!record.isInternal())
{fireFieldChange=true;nlapiFCValue=record.getModelController().getFieldValue(internalFieldChangeScriptFieldId);record.getModelController().setFieldValue(internalFieldChangeScriptFieldId,{value:'',legacyStringValue:''});}
if(fireFieldChange)
{var line=-1;if(record.isSublistAListMachine(sublistId)||record.isMultilineEditable(sublistId))
{line=record.getModelController().getSublistLineValueForInstance(sublistId,'_sequence',lineInstanceId,useBuffer);line=recordUtil.getOneBasedIndex(line);}
if(record.isMultilineEditable(sublistId))
{if(!isUpdatingSlavingField)
record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,triggerValidateFieldScript,that,[sublistId,fieldId,line]);record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,triggerFieldChangeEventForInstance,that,[sublistId,fieldId,line,lineInstanceId,dbValue,noSlaving]);}
else
{if(!isUpdatingSlavingField)
record.triggerValidateFieldScript(sublistId,fieldId,line);record.triggerFieldChangeEventForInstance(sublistId,fieldId,line,lineInstanceId,dbValue,noSlaving);}}
if(!nlapiFCValue)
record.getModelController().setFieldValue(internalFieldChangeScriptFieldId,{value:nlapiFCValue,legacyStringValue:nlapiFCValue});}
this.postSetFieldValueForInstance=postSetFieldValueForInstance;function triggerFieldChangeEvent(sublistId,fieldId,line,value,noSlaving)
{record.triggerFieldChangeScript(sublistId,fieldId,line);record.doSlaving(sublistId,fieldId,line,value,noSlaving);}
this.triggerFieldChangeEvent=triggerFieldChangeEvent;function triggerFieldChangeEventForInstance(sublistId,fieldId,line,lineInstanceId,value,noSlaving)
{record.triggerFieldChangeScript(sublistId,fieldId,line);record.doSlavingForInstance(sublistId,fieldId,line,lineInstanceId,value,noSlaving);}
this.triggerFieldChangeEventForInstance=triggerFieldChangeEventForInstance;function doProcessSlavingValues(slaveValues,sublistId,fieldId,line)
{if(!!slaveValues)
{record.applySlaveValues(postProcessSlaveValues(slaveValues));record.triggerCustomPostSourcingScript(sublistId,fieldId,line);}}
function doGetClientSlavingResultFromMetadata(clientSlavingMetadata,stringifiedVal,getMetadataFunction,forceSync)
{if(forceSync)
return recordUtil.getClientSlavingResultFromMetadata(clientSlavingMetadata,stringifiedVal,getMetadataFunction);else
return new Promise(function(resolve,reject)
{try
{resolve(recordUtil.getClientSlavingResultFromMetadata(clientSlavingMetadata,stringifiedVal,getMetadataFunction));}
catch(e)
{reject(e);}});}
function doPerformSlaving(sublistId,fieldId,lineNum,lineInstanceId,value,noSlaving,restrictField)
{if(noSlaving===undef)
noSlaving=false;var slaveValues,metadata=record.getSlavingMetadata(sublistId,fieldId),clientSlavingMetadata=record.getClientSlavingMetadata(sublistId,fieldId),forceSync=(metadata&&metadata.forceSyncSlaving)?metadata.forceSyncSlaving:!record.getIsCurrentRecord();if(!noSlaving)
{if(metadata&&metadata.noSlavingValue!==String(value))
{var ln=(record.isSublistAListMachine(sublistId))?record.doGetCurrentSublistIndex(sublistId):null;var fieldToSlave=(restrictField&&typeof restrictField!=='boolean')?restrictField:'T';var masterInfo={queryFieldName:String(fieldId),queryFieldValue:String(value),sublistId:sublistId?String(sublistId):undef,fieldspec:fieldToSlave,lineNum:lineNum,lineInstanceId:lineInstanceId};slaveValues=record.sendSlavingRequest(postProcessSlavingMetadata(metadata),masterInfo);}
else if(clientSlavingMetadata)
{slaveValues=doGetClientSlavingResultFromMetadata(clientSlavingMetadata,String(value),record.getClientSlavingMetadata,forceSync);}}
if(!!slaveValues)
{if(forceSync)
doProcessSlavingValues(slaveValues,sublistId,fieldId,lineNum);else
slaveValues.then(function(result)
{function doThis(obj)
{var retMe=obj;if(obj.hasOwnProperty("machine"))retMe.lineInstanceId=lineInstanceId;return retMe;}
if(!!result&&!!result.fields)
result.fields=result.fields.map(doThis);record.getModelController().runFunctionWhileSilentlySelectingLine(sublistId,lineInstanceId,doProcessSlavingValues,that,[result,sublistId,fieldId,lineNum]);},function(reason){throw reason;});}}
function doSlaving(sublistId,fieldId,line,value,noSlaving,restrictField)
{var useBuffer=true,lineInstanceId=record.getModelController().getSublistLineInstanceIdForLine(sublistId,line,useBuffer);doPerformSlaving(sublistId,fieldId,line,lineInstanceId,value,noSlaving,restrictField)}
this.doSlaving=doSlaving;function doSlavingForInstance(sublistId,fieldId,line,lineInstanceId,value,noSlaving,restrictField)
{doPerformSlaving(sublistId,fieldId,line,lineInstanceId,value,noSlaving,restrictField)}
this.doSlavingForInstance=doSlavingForInstance;function postProcessSlavingMetadata(metadata)
{var REQUIRED_SCRIPT='requiredScript';var auxfields=metadata['auxfields'];for(var idx=0;auxfields&&idx<auxfields.length;idx++)
{var auxfld=auxfields[idx];if(auxfld.hasOwnProperty(REQUIRED_SCRIPT))
{auxfld.isRequired=recordScriptingScope.runInternalScriptAndReturnBooleanResult(auxfld[REQUIRED_SCRIPT]);}}
return metadata;}
function postProcessSlaveValues(slaveValues)
{var CONDITION='condition';for(var idx=0;slaveValues.body&&idx<slaveValues.body.length;idx++)
{if(slaveValues.body[idx].hasOwnProperty(CONDITION))
{slaveValues.body[idx][CONDITION]=recordScriptingScope.runInternalScriptAndReturnBooleanResult(slaveValues.body[idx][CONDITION]);}}
return slaveValues;}
function triggerPageInitScript()
{recordScriptingScope.pageInit();}
this.triggerPageInitScript=triggerPageInitScript;function triggerLineInitScript(sublistId)
{recordScriptingScope.lineInit(sublistId);}
this.triggerLineInitScript=triggerLineInitScript;function triggerPostDeleteLineScript(sublistId,line_1)
{recordScriptingScope.postDeleteLine(sublistId,line_1)}
this.triggerPostDeleteLineScript=triggerPostDeleteLineScript;function triggerLineCommitScript(sublistId,line_1)
{recordScriptingScope.lineCommit(sublistId,line_1)}
this.triggerLineCommitScript=triggerLineCommitScript;function triggerValidateLineScript(sublistId)
{recordScriptingScope.validateLine(sublistId);}
this.triggerValidateLineScript=triggerValidateLineScript;function triggerValidateInsertScript(sublistId)
{recordScriptingScope.validateInsert(sublistId);}
this.triggerValidateInsertScript=triggerValidateInsertScript;function triggerValidateDeleteScript(sublistId)
{recordScriptingScope.validateDelete(sublistId);}
this.triggerValidateDeleteScript=triggerValidateDeleteScript;function triggerValidateFieldScript(sublistId,fieldId,line_1,matrixColumn)
{recordScriptingScope.validateField(sublistId,fieldId,line_1,matrixColumn);}
this.triggerValidateFieldScript=triggerValidateFieldScript;function triggerFieldChangeScript(sublistId,fieldId,line_1,matrixColumn)
{recordScriptingScope.fieldChange(sublistId,fieldId,line_1,matrixColumn);}
this.triggerFieldChangeScript=triggerFieldChangeScript;function triggerCanCreateSubrecordScript(sublistId,fieldId,line_1)
{recordScriptingScope.canCreateSubrecord(sublistId,fieldId,line_1)}
this.triggerCanCreateSubrecordScript=triggerCanCreateSubrecordScript;function triggerSaveRecordScript(ignoreMandatoryFields)
{recordScriptingScope.saveRecord(ignoreMandatoryFields);}
this.triggerSaveRecordScript=triggerSaveRecordScript;function triggerRecalcScript(sublistId,localRecalc,operation)
{recordScriptingScope.recalc(sublistId,localRecalc,operation);}
this.triggerRecalcScript=triggerRecalcScript;function triggerMachinePostSourcing(postSourcingScript)
{recordScriptingScope.postSublistSourcing(postSourcingScript);}
this.triggerMachinePostSourcing=triggerMachinePostSourcing;function triggerCustomPostSourcingScript(sublistId,fieldId,line)
{recordScriptingScope.postSourcing(sublistId,fieldId,line);}
this.triggerCustomPostSourcingScript=triggerCustomPostSourcingScript;}
function create(record)
{return new DynamicRecordImpl(record);}
return{create:create};});define('N/record/deferredDynamicRecordImpl',['N/record/recordUtilityFunctions','N/utilityFunctions','N/error'],function(recordUtil,utilityFunctions,error)
{function DeferredDynamicRecordImpl(record)
{var undef=undefined;function initRecord(record,scope)
{if(record.getIsReadOnlyRecord())
return;scope.pageInit();record.resetsetRecordStateController();}
this.initRecord=initRecord;this.shouldValidateFieldPermissions=recordUtil.no_op_function;function isUnchangedExistingRecord(fieldState)
{return!record.isNewRecord()&&!fieldState.isChanged;}
function validateTextApi(isTextApi,fieldState,setterMethod,suggestedMethod)
{if(((isTextApi&&!fieldState.useTextApi)||(!isTextApi&&fieldState.useTextApi))&&!isUnchangedExistingRecord(fieldState))
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_API_USAGE,suggestedMethod,setterMethod)}}
this.validateTextApi=validateTextApi;this.validateLineIndex=recordUtil.no_op_function;this.getCachedOptionsForRecordField=recordUtil.no_op_function;function isSublistAScriptableMachine(sublistId)
{return record.getSublistMetadata(sublistId)&&record.getSublistMetadata(sublistId).isScriptableMachine;}
function insertLineIfNewLineAndGetNewInstanceId(sublistId,line,useBuffer)
{var isScriptableOrEditable=(isSublistAScriptableMachine(sublistId)||record.isSublistAnEditMachine(sublistId));var isLineZeroAndNoneExists=(line==Math.max(record.doGetLineCount(sublistId),0));if(isScriptableOrEditable&&isLineZeroAndNoneExists)
record.doInsertLine(sublistId,line);return record.getModelController().getSublistLineInstanceIdForLine(sublistId,line,useBuffer);}
function getLineInstanceId(sublistId,line,useBuffer)
{var lineInstanceId=record.getModelController().getSublistLineInstanceIdForLine(sublistId,line,useBuffer);if(lineInstanceId===null)
lineInstanceId=insertLineIfNewLineAndGetNewInstanceId(sublistId,line,useBuffer);return lineInstanceId;}
this.getLineInstanceId=getLineInstanceId;function doGetText(fieldId,delegator)
{var value=undef;var fieldState=record.getFieldState(fieldId);if(isUnchangedExistingRecord(fieldState))
{value=delegator.getTextValue(fieldId);}
else
value=record.doGetValue(fieldId);return value;}
this.doGetText=doGetText;function getParsedValueForBodyField(fieldId,delegator)
{var isFieldChange=record.getFieldState(fieldId).isChanged;if(!isFieldChange)
return delegator.getParsedValue(fieldId);else
return record.doGetValue(fieldId);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function doSetValue(fieldId,value,fireFieldChange,noSlaving)
{record.doSetFieldValue(fieldId,value,false,true);}
this.doSetValue=doSetValue;this.postSetFieldValue=recordUtil.no_op_function;this.postSetFieldValueForInstance=recordUtil.no_op_function;function doSetText(fieldId,text)
{var fireFieldChanged=false;var noSlaving=true;record.doSetFieldValue(fieldId,text,fireFieldChanged,noSlaving);record.getFieldState(fieldId).useTextApi=true;}
this.doSetText=doSetText;this.validateAndFormatFieldValue=recordUtil.no_op_function;this.validateAndFormatFieldValueForInstance=recordUtil.no_op_function;function doGetParsedSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator)
{var value=undef;var isFieldChanged=record.getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer).isChanged;if(!isFieldChanged)
{value=delegator.getParsedValue(fieldId);}
else
{value=record.doGetSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
return value;}
this.doGetParsedSublistValueForInstance=doGetParsedSublistValueForInstance;function setSublistValue(options,fieldId,line,value)
{var sublistId;var useBuffer=false;if(fieldId!==undef&&line!==undef&&value!=undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;line=options.line;value=options.value;}
utilityFunctions.checkArgs([sublistId,fieldId,line],['sublistId','fieldId','line'],record.getMissingArgumentErrorMessageFillerValue("setSublistValue"));if(line<0)
return;recordUtil.validateAgainstSqlInjection(fieldId,value);record.doSetSublistValue(sublistId,fieldId,line,value);record.getSublistFieldState(sublistId,fieldId,line,useBuffer).useTextApi=false;}
this.setSublistValue=setSublistValue;function doGetSublistTextForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator)
{var value=undef;var fieldState=record.getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer);if(isUnchangedExistingRecord(fieldState))
{value=delegator.getTextValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
else
value=record.doGetSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);return value;}
this.doGetSublistTextForInstance=doGetSublistTextForInstance;function setSublistText(options,fieldId,line,text)
{var sublistId;if(fieldId!==undef&&line!==undef&&text!=undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;line=options.line;text=options.text;}
utilityFunctions.checkArgs([sublistId,fieldId,line],['sublistId','fieldId','line'],record.getMissingArgumentErrorMessageFillerValue("setSublistText"));recordUtil.validateAgainstSqlInjection(fieldId,text);doSetSublistText(sublistId,fieldId,line,text);}
this.setSublistText=setSublistText;function doSetSublistText(sublistId,fieldId,line,text)
{var useBuffer=false;record.doSetSublistValue(sublistId,fieldId,line,text);record.getSublistFieldState(sublistId,fieldId,line,useBuffer).useTextApi=true;}
this.preInsertLine=recordUtil.no_op_function;this.preInsertLineForInstance=recordUtil.no_op_function;this.postInsertLine=recordUtil.no_op_function;this.postInsertLineForInstance=recordUtil.no_op_function;function removeSublistLine(sublistId,line,ignoreRecalc)
{record.doRemoveSublistLine(sublistId,line);}
this.removeSublistLine=removeSublistLine;function removeSublistLineForInstance(sublistId,lineInstanceId,ignoreRecalc)
{record.doRemoveSublistLineForInstance(sublistId,lineInstanceId);}
this.removeSublistLineForInstance=removeSublistLineForInstance;this.doSlaving=recordUtil.no_op_function;this.postRemoveLine=recordUtil.no_op_function;this.postRemoveLineForInstance=recordUtil.no_op_function;this.addNewLine=recordUtil.no_op_function;this.selectLine=recordUtil.no_op_function;this.selectNewLine=recordUtil.no_op_function;this.cancelLine=recordUtil.no_op_function;this.cancelLineForInstance=recordUtil.no_op_function;this.commitLine=recordUtil.no_op_function;this.commitLineForInstance=recordUtil.no_op_function;this.getCurrentSublistValue=recordUtil.no_op_function;this.setCurrentSublistValue=recordUtil.no_op_function;this.getCurrentSublistText=recordUtil.no_op_function;this.setCurrentSublistText=recordUtil.no_op_function;this.triggerFieldChangeEvent=recordUtil.no_op_function;this.triggerPageInitScript=recordUtil.no_op_function;this.triggerLineInitScript=recordUtil.no_op_function;this.triggerPostDeleteLineScript=recordUtil.no_op_function;this.triggerLineCommitScript=recordUtil.no_op_function;this.triggerValidateLineScript=recordUtil.no_op_function;this.triggerValidateInsertScript=recordUtil.no_op_function;this.triggerValidateDeleteScript=recordUtil.no_op_function;this.triggerValidateFieldScript=recordUtil.no_op_function;this.triggerFieldChangeScript=recordUtil.no_op_function;this.triggerCanCreateSubrecordScript=recordUtil.no_op_function;this.triggerSaveRecordScript=recordUtil.no_op_function;this.triggerRecalcScript=recordUtil.no_op_function;this.triggerMachinePostSourcing=recordUtil.no_op_function;this.triggerCustomPostSourcingScript=recordUtil.no_op_function;}
function create(record)
{return new DeferredDynamicRecordImpl(record);}
return{create:create};});define('N/record/recordImplementation',['N/record/dynamicRecordImpl','N/record/deferredDynamicRecordImpl'],function(dynamicRecordImpl,deferredDynamicRecordImpl){function create(isDynamicRecord,record)
{return isDynamicRecord?dynamicRecordImpl.create(record):deferredDynamicRecordImpl.create(record);}
return{create:create};});define('N/restricted/scopeRemoteApiBridge',['N/restricted/reflet'],function(reflet){return reflet;});define('N/record/subrecordController',['N/utilityFunctions','N/error','N/record/matrix','N/util/currencyUtility','N/util/date','N/util/formatter','N/record/recordCacheController'],function(utilityFunctions,error,matrix,currency,date,formatter,recordCacheController){function subrecordController(record)
{var uncommittedSubrecordCache=recordCacheController.create();function createSubrecord(fieldId)
{var result=null;var field,type,id;utilityFunctions.checkArgs([fieldId],['fieldId'],'createSubrecord');result=uncommittedSubrecordCache.get(null,fieldId);if(!!result||record.hasSubrecord(fieldId))
{utilityFunctions.throwSuiteScriptError(error.Type.FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD,fieldId);}
else
{result=record.doGetBodySubrecord(fieldId);result=result.internalClone();uncommittedSubrecordCache.put(null,fieldId,null,result);}
return result;}
function editSubrecord(fieldId)
{var result=null;var field,type,id;utilityFunctions.checkArgs([fieldId],['fieldId'],'editSubrecord');result=uncommittedSubrecordCache.get(null,fieldId);if(!result&&record.hasSubrecord(fieldId)){result=record.doGetBodySubrecord(fieldId);result=result.internalClone();uncommittedSubrecordCache.put(null,fieldId,null,result);}
return result;}
function viewSubrecord(fieldId)
{var result=null;var field,type,id;utilityFunctions.checkArgs([fieldId],['fieldId'],'viewSubrecord');result=uncommittedSubrecordCache.get(null,fieldId);if(!result&&record.hasSubrecord(fieldId)){result=record.doGetBodySubrecord(fieldId);result=result.internalClone();}
return result;}
function removeSubrecord(fieldId)
{uncommittedSubrecordCache.invalidate(null,fieldId);record.performSubrecordRemoval(fieldId);}
function createCurrentLineItemSubrecord(sublistId,fieldId)
{var result=null;var useBuffer=true;var modelController=record.getModelController();var lineInstanceId=modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer);if(record.hasCurrentSublistSubrecord(sublistId,fieldId)||uncommittedSubrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer)!=null)
{utilityFunctions.throwSuiteScriptError(error.Type.FIELD_1_ALREADY_CONTAINS_A_SUBRECORD_YOU_CANNOT_CALL_CREATESUBRECORD,sublistId+"."+fieldId);}
else
{result=record.doGetCurrentSublistSubrecord(sublistId,fieldId);uncommittedSubrecordCache.put(null,fieldId,null,result);}
return result;}
function editCurrentLineItemSubrecord(sublistId,fieldId)
{var useBuffer=true;var modelController=record.getModelController();var lineInstanceId=modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer);var result=uncommittedSubrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);if(!result&&record.hasCurrentSublistSubrecord(sublistId,fieldId))
{result=record.doGetCurrentSublistSubrecord(sublistId,fieldId);result=result.internalClone();uncommittedSubrecordCache.put(sublistId,fieldId,lineInstanceId,result,useBuffer);}
return!result?null:result;}
function removeCurrentLineItemSubrecord(sublistId,fieldId)
{var useBuffer=true;var modelController=record.getModelController();var lineInstanceId=modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer);uncommittedSubrecordCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);record.doRemoveSublistSubrecordForInstance(sublistId,fieldId,lineInstanceId,useBuffer)}
function viewCurrentLineItemSubrecord(sublistId,fieldId)
{var useBuffer=true;var modelController=record.getModelController();var lineInstanceId=modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer);var result=uncommittedSubrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);if(!result&&record.hasCurrentSublistSubrecord(sublistId,fieldId))
{result=record.doGetCurrentSublistSubrecord(sublistId,fieldId);result=result.internalClone();}
if(!!result)
{result.setReadonly();}
return!result?null:result;}
function viewLineItemSubrecord(sublistId,fieldId,line)
{var useSelectedLineBuffer=line===-1;var useBuffer=useSelectedLineBuffer;var modelController=record.getModelController();var lineInstanceId=useSelectedLineBuffer?modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer):modelController.getSublistLineInstanceIdForLine(sublistId,line,useBuffer);var result=uncommittedSubrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);if(!result&&record.hasSublistSubrecord(sublistId,fieldId,line))
{result=record.doGetSublistSubrecord(sublistId,fieldId,line);result=result.internalClone();}
if(!!result)
{result.setReadonly();}
return!result?null:result;}
function commit(subrecordToCommit)
{var subrecord,sublistId,fieldId;if(!!record.subrecordParent)
{record.triggerSaveRecordScript();record.subrecordParent.commit(record);}
else if(!record.subrecordParent&&!!subrecordToCommit)
{sublistId=subrecordToCommit.subrecordSublistId||null;fieldId=subrecordToCommit.subrecordFieldId;if(sublistId===null)
{if(subrecordToCommit===uncommittedSubrecordCache.get(null,fieldId))
{subrecord=record.getSubrecord(fieldId);subrecord.setModelController(subrecordToCommit.getModelController());subrecord.setRecordStateController(subrecordToCommit.getRecordStateController());uncommittedSubrecordCache.invalidate(null,fieldId);record.triggerFieldChangeEvent(null,fieldId,-1,record.getFieldValue(fieldId),false);}}
else
{}}}
function getUncommittedSubrecord(sublistId,fieldId,line0)
{sublistId=sublistId||null;line0=(!isNaN(line0)&&line0>=0&&line0)||-1;var useSelectedLineBuffer=line0===-1;var useBuffer=useSelectedLineBuffer;var modelController=record.getModelController();var lineInstanceId=useSelectedLineBuffer?modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer):modelController.getSublistLineInstanceIdForLine(sublistId,line0,useBuffer);return uncommittedSubrecordCache.get(sublistId,fieldId,lineInstanceId,useBuffer);}
function invalidateSubrecordCacheForV1RecordScope()
{uncommittedSubrecordCache=recordCacheController.create();}
function invalidateSubrecordCacheEntry(sublistId,fieldId,line_0)
{var useSelectedLineBuffer=line_0===-1;var useBuffer=useSelectedLineBuffer;var modelController=record.getModelController();var lineInstanceId=useSelectedLineBuffer?modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer):modelController.getSublistLineInstanceIdForLine(sublistId,line_0,useBuffer);uncommittedSubrecordCache.invalidate(sublistId,fieldId,lineInstanceId,useBuffer);}
function insertLineForSubrecordCache(sublistId,line)
{var useSelectedLineBuffer=line===-1;var useBuffer=useSelectedLineBuffer;var modelController=record.getModelController();var lineInstanceId=useSelectedLineBuffer?modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer):modelController.getSublistLineInstanceIdForLine(sublistId,line,useBuffer);uncommittedSubrecordCache.get(sublistId,null,lineInstanceId,useBuffer);}
function removeLineForSubrecordCache(sublistId,line)
{var useSelectedLineBuffer=line===-1;var useBuffer=useSelectedLineBuffer;var modelController=record.getModelController();var lineInstanceId=useSelectedLineBuffer?modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer):modelController.getSublistLineInstanceIdForLine(sublistId,line,useBuffer);uncommittedSubrecordCache.invalidate(sublistId,null,lineInstanceId,useBuffer);}
function invalidateCurrentSublistLineForSubrecordCache(sublistId)
{var useBuffer=true;var modelController=record.getModelController();var lineInstanceId=modelController.getSublistLineInstanceIdForLine(sublistId,modelController.getCurrentSublistLineIndex(sublistId),useBuffer);uncommittedSubrecordCache.invalidate(sublistId,null,lineInstanceId,useBuffer);}
return{createSubrecord:createSubrecord,editSubrecord:editSubrecord,viewSubrecord:viewSubrecord,removeSubrecord:removeSubrecord,createCurrentLineItemSubrecord:createCurrentLineItemSubrecord,editCurrentLineItemSubrecord:editCurrentLineItemSubrecord,removeCurrentLineItemSubrecord:removeCurrentLineItemSubrecord,viewCurrentLineItemSubrecord:viewCurrentLineItemSubrecord,viewLineItemSubrecord:viewLineItemSubrecord,commit:commit,getUncommittedSubrecord:getUncommittedSubrecord,invalidateSubrecordCacheForV1RecordScope:invalidateSubrecordCacheForV1RecordScope,invalidateSubrecordCacheEntry:invalidateSubrecordCacheEntry,insertLineForSubrecordCache:insertLineForSubrecordCache,removeLineForSubrecordCache:removeLineForSubrecordCache,invalidateCurrentSublistLineForSubrecordCache:invalidateCurrentSublistLineForSubrecordCache}}
function create(record)
{return new subrecordController(record);}
return Object.freeze({create:create});});define('N/record/legacyNLObjects',['N/restricted/remoteApiBridge','N/restricted/invoker','N/utilityFunctions','N/runtime'],function(remoteApi,invoker,utilityFunctions,runtime){var getRecordModule=(function(){var module;return function getRecordModule(){if(!module)
{require.forceSync(true);require(['N/record'],function(rm){module=rm;});require.forceSync(false);}
return module;}}());var getRecordImplModule=(function(){var module;return function getRecordModule(){if(!module)
{require.forceSync(true);require.setInternal(true);require(['N/record/recordImpl'],function(rm){module=rm;});require.setInternal(false);require.forceSync(false);}
return module;}}());var getRecordImplV1Module=(function(){var module;return function getRecordModule(){if(!module)
{require.forceSync(true);require.setInternal(true);require(['N/record/recordImplV1'],function(rm){module=rm;});require.setInternal(false);require.forceSync(false);}
return module;}}());var getRecordImplV1=function(rawRecord){if(!rawRecord)return null;if(rawRecord.constructor.name==='RecordImplV1')return rawRecord;if(rawRecord.constructor.name==='Record')return getRecordImplV1Module().create({record:rawRecord});return null;};var nlobjRecordGetter=(function()
{var nlobjRecord;return function nlobjRecordGetter()
{if(!nlobjRecord)
{nlobjRecord=function nlobjRecord(type,id){this.type=type;this.id=id;this.fields={};this.fieldnames=[];this.lineitems=[];this.linetypes={};this.linefields={};this.matrixfields={};this.currentlineitems={};this.currentlineitemindexes={};this.initialized=false;this.operations=[];};nlobjRecord.prototype.getId=function(){return this.id;};nlobjRecord.prototype.getRecordType=function(){return this.type;};nlobjRecord.prototype.setFieldValue=function(name,value){this.fields[name]=value;this.logOperation("setFieldValue",{"field":name,"value":value})};nlobjRecord.prototype.setFieldValues=function(name,values){this.fields[name]=values;this.logOperation("setFieldValues",{"field":name,"value":values})};nlobjRecord.prototype.getFieldValue=function(name){return!!this.fields[name]?this.fields[name]:null;};nlobjRecord.prototype.getFieldValues=function(name){return!!this.fields[name]?this.fields[name]:null;};nlobjRecord.prototype.getAllFields=function(){var s=[];for(var f in this.fields)
if(this.fields.hasOwnProperty(f))
s[s.length++]=f;for(var i=0;i<this.fieldnames.length;i++)
utilityFunctions.arrayAdd(s,this.fieldnames[i]);return s;};nlobjRecord.prototype.getAllLineItems=function(){var s=[];for(var f in this.lineitems)
if(this.lineitems.hasOwnProperty(f))
s[s.length++]=f;return s;};nlobjRecord.prototype.getAllLineItemFields=function(name){var linegroup=this.linefields[name];if(!linegroup)
return null;var s=[];for(var i=0;i<this.linefields[name].length;i++)
s[s.length++]=this.linefields[name][i];return s;};nlobjRecord.prototype.setLineItemValue=function(group,name,line,value){assertTrue(line>0&&line-1<=this.getLineItemCount(group),'SSS_INVALID_SUBLIST_OPERATION');if(line-1===this.getLineItemCount(group))
this.selectNewLineItem(group);else if(line<=this.getLineItemCount(group))
this.selectLineItem(group,line);this.setCurrentLineItemValue(group,name,value);this.commitLineItem(group)};nlobjRecord.prototype.setAndCommitLineItemValue=function(group,name,line,value){var linegroup=this.lineitems[group];if(!linegroup){linegroup=[];this.lineitems[group]=linegroup;}
var lineitem=linegroup[line];if(!lineitem){lineitem=new Array(1);linegroup[line]=lineitem;}
lineitem[name]=value;};nlobjRecord.prototype.insertLineItem=function(type,line){assertTrue(this.linetypes[type]==='edit','SSS_INVALID_SUBLIST_OPERATION');if(this.getCurrentLineItemIndex(type)===-1){if(line-1===this.getLineItemCount(type)||isNaN(parseInt(line)))
this.selectNewLineItem(type);else if(line<=this.getLineItemCount(type))
this.selectLineItem(type,line)}
var linegroup=this.lineitems[type];if(!linegroup){linegroup=new Array(1);this.lineitems[type]=linegroup;}
linegroup.splice(line,0,[]);this.logOperation("insertLineItem",{"type":type})};nlobjRecord.prototype.removeLineItem=function(type,line){assertTrue(this.linetypes[type]==='edit','SSS_INVALID_SUBLIST_OPERATION');if(this.getCurrentLineItemIndex(type)===-1){if(line-1===this.getLineItemCount(type)||isNaN(parseInt(line)))
this.selectNewLineItem(type);else if(line<=this.getLineItemCount(type))
this.selectLineItem(type,line)}
var linegroup=this.lineitems[type];if(!linegroup||this.getLineItemCount(type)<line)
return;linegroup.splice(line,1);this.logOperation("removeLineItem",{"type":type});if(this.getCurrentLineItemIndex(type)!==-1){this.currentlineitems[type]=null;this.currentlineitemindexes[type]=null;}};nlobjRecord.prototype.getLineItemValue=function(group,name,line){var value=null;var linegroup=this.lineitems[group];if(!!linegroup){var lineitem=linegroup[line];if(!!lineitem)
value=lineitem[name];}
return value!=null?value:null;};nlobjRecord.prototype.getLineItemCount=function(group){var linegroup=this.lineitems[group];return!!linegroup?linegroup.length-1:0;};nlobjRecord.prototype.setLineItemMatrixValue=function(type,fldnam,linenum,column,value){if(this.isMatrixField(type,fldnam))
this.setLineItemValue(type,this.getMatrixFieldName(type,fldnam,column),linenum,value)};nlobjRecord.prototype.getLineItemMatrixValue=function(type,fldnam,linenum,column){if(this.isMatrixField(type,fldnam))
return this.getLineItemValue(type,this.getMatrixFieldName(type,fldnam,column),linenum);return null;};nlobjRecord.prototype.findLineItemValue=function(type,fldnam,value){for(var linenum=1;linenum<=this.getLineItemCount(type);linenum++)
if(value==this.getLineItemValue(type,fldnam,linenum))
return linenum;return-1;};nlobjRecord.prototype.findLineItemMatrixValue=function(type,fldnam,column,value){if(this.isMatrixField(type,fldnam))
return this.findLineItemValue(type,this.getMatrixFieldName(type,fldnam,column),value);return-1;};nlobjRecord.prototype.setMatrixValue=function(type,fldnam,column,value){if(this.isMatrixField(type,fldnam)){this.fields[this.getFieldValue(type+'header')+column]=value;this.logOperation("setMatrixValue",{"type":type,"field":name,"column":column,"value":value})}};nlobjRecord.prototype.getMatrixValue=function(type,fldnam,column){return this.isMatrixField(type,fldnam)?this.getFieldValue(this.getFieldValue(type+'header')+column):null;};nlobjRecord.prototype.getMatrixCount=function(type,fldnam){return this.isMatrixField(type,fldnam)?this.getFieldValue(this.getFieldValue(type+'headercount')):null;};nlobjRecord.prototype.selectLineItem=function(type,linenum){assertTrue(!!this.linetypes[type]&&linenum>0&&linenum<=this.getLineItemCount(type),'SSS_INVALID_SUBLIST_OPERATION');this.currentlineitems[type]={};this.currentlineitemindexes[type]=linenum;var flds=this.getAllLineItemFields(type);for(var i=0;i<flds.length;i++)
this.currentlineitems[type][flds[i]]=this.getLineItemValue(type,flds[i],linenum)
this.logOperation("selectLineItem",{"type":type,"linenum":linenum})};nlobjRecord.prototype.selectNewLineItem=function(type){assertTrue(!!this.linetypes[type]&&this.linetypes[type]==='edit','SSS_INVALID_SUBLIST_OPERATION');this.currentlineitems[type]={};this.currentlineitemindexes[type]=this.getLineItemCount(type)+1;this.logOperation("selectNewLineItem",{"type":type})};nlobjRecord.prototype.cancelLineItem=function(type){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');this.currentlineitems[type]=null;this.currentlineitemindexes[type]=null;this.logOperation("cancelLineItem",{"type":type})};nlobjRecord.prototype.commitLineItem=function(type){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');var flds=this.getAllLineItemFields(type);var linenum=this.getCurrentLineItemIndex(type);for(var i=0;i<flds.length;i++)
this.setAndCommitLineItemValue(type,flds[i],linenum,this.currentlineitems[type][flds[i]])
this.currentlineitems[type]=null;this.currentlineitemindexes[type]=null;this.logOperation("commitLineItem",{"type":type})};nlobjRecord.prototype.getCurrentLineItemIndex=function(type){return!!this.currentlineitems[type]?this.currentlineitemindexes[type]:-1;};nlobjRecord.prototype.getCurrentLineItemValue=function(type,name){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');return this.currentlineitems[type][name]};nlobjRecord.prototype.setCurrentLineItemValue=function(type,name,value){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');this.currentlineitems[type][name]=value;this.logOperation("setCurrentLineItemValue",{"type":type,"field":name,"value":value})};nlobjRecord.prototype.setCurrentLineItemMatrixValue=function(type,fldnam,column,value){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');this.currentlineitems[type][this.getMatrixFieldName(type,fldnam,column)]=value;this.logOperation("setCurrentLineItemMatrixValue",{"type":type,"field":fldnam,"column":column,"value":value})};nlobjRecord.prototype.getCurrentLineItemMatrixValue=function(type,fldnam,column){assertTrue(this.getCurrentLineItemIndex(type)!==-1,'SSS_INVALID_SUBLIST_OPERATION');return this.currentlineitems[type][this.getMatrixFieldName(type,fldnam,column)]};nlobjRecord.prototype.setFieldText=function(name,text){throwLegacyUnsupportedError();};nlobjRecord.prototype.setFieldTexts=function(name,texts){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldText=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldTexts=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemText=function(type,name,line){throwLegacyUnsupportedError();};nlobjRecord.prototype.getCurrentLineItemText=function(type,name){throwLegacyUnsupportedError();};nlobjRecord.prototype.setCurrentLineItemText=function(type,name,text){throwLegacyUnsupportedError();};nlobjRecord.prototype.getField=function(fldnam){throwLegacyUnsupportedError();};nlobjRecord.prototype.getSublist=function(type){throwLegacyUnsupportedError();};nlobjRecord.prototype.getMatrixField=function(type,fldnam){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemField=function(type,name,linenum){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemField=function(type,name,linenum){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldDisabled=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldMandatory=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldDisplay=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldVisibility=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getFieldLabel=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemDisplay=function(name){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemDisabled=function(type,name,linenum){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemMandatory=function(type,name,linenum){throwLegacyUnsupportedError();};nlobjRecord.prototype.getLineItemLabel=function(type,name){throwLegacyUnsupportedError();};nlobjRecord.prototype.isMatrixField=function(type,fld){return this.getFieldValue(type+'matrixfields')!=null&&utilityFunctions.arrayIndexOf(this.getFieldValue(type+'matrixfields').split(","),fld)!==-1;};nlobjRecord.prototype.getMatrixFieldName=function(type,fldnam,column){return this.isMatrixField(type,fldnam)?fldnam+"_"+column+"_":null;};nlobjRecord.prototype.logOperation=function(operation,args){if(this.initialized)this.operations.push({"operation":operation,"args":args});};nlobjRecord.prototype.getDateTimeValue=function(fldname,timezone){if(!timezone)
return this.getFieldValue(fldname);else{var storedDateTime=this.getFieldValue(fldname);var preferredTimeZone=runtime.getCurrentUser().getPreference("TIMEZONE");if(preferredTimeZone===timezone)
return storedDateTime;else
return invoker(remoteApi,'calculateGetDateTimeWithTimeZone',[storedDateTime,timezone]);}};nlobjRecord.prototype.setDateTimeValue=function(fldname,value,timezone){if(!timezone)
return this.setFieldValue(fldname,value);else{var preferredTimeZone=runtime.getCurrentUser().getPreference("TIMEZONE");if(preferredTimeZone===timezone)
return this.setFieldValue(fldname,value);else{var newVal=invoker(remoteApi,'calculateGetDateTimeWithTimeZone',[value,timezone]);return this.setFieldValue(fldname,newVal);}}};nlobjRecord.prototype.calculateTax=function(){throwLegacyUnsupportedError();};}
return nlobjRecord;};})();var nlobjRecordWrapper=function(record,operation,options)
{if(!record)return record;var v1Record=getRecordImplV1(record);if(v1Record)
{var nlobjrecord=new(nlobjRecordGetter())(v1Record.getRecordType(),v1Record.getId());nlobjrecord.fieldnames=v1Record.getAllFields()||[];nlobjrecord.fieldnames.forEach(function(fld){var val=v1Record.getFieldValue(fld);nlobjrecord.setFieldValue(fld,val);});nlobjrecord.linetypes=(function(){var linetypes={};(v1Record.getAllSublists()||[]).forEach(function(sl){linetypes[sl]=v1Record.getSublistType(sl);});return linetypes;})();nlobjrecord.linefields=(function(){var linefields={};(v1Record.getAllSublists()||[]).forEach(function(sl){linefields[sl]=v1Record.getAllLineItemFields(sl)||[];var backwardCompatibilityMap=(v1Record._getSubrecordBackwardCompatibilityMap(sl)||[]);backwardCompatibilityMap.forEach(function(fld){if(linefields[sl].indexOf(fld)==-1&&linefields[sl].indexOf(fld+'_initialvalue')>-1)
linefields[sl].push(fld);});var lineCount=v1Record.getLineItemCount(sl);for(var line_1=1;line_1<lineCount+1;line_1++)
{linefields[sl].forEach(function(lineFld){var val=v1Record.getLineItemValue(sl,lineFld,line_1);nlobjrecord.setAndCommitLineItemValue(sl,lineFld,line_1,val);});}});return linefields;})();nlobjrecord.matrixfields=(function(){var matrixfields={};(v1Record.getAllSublists()||[]).forEach(function(sl){var mfv=v1Record.getFieldValue(sl+'matrixfields');if(!!mfv)matrixfields[sl]=mfv.split(',');});return matrixfields;})();nlobjrecord.initialized=true;nlobjrecord.logOperation(operation,{'defaultValues':options.defaultValues});return nlobjrecord;}};var nlobjSublistGetter=(function()
{var nlobjSubList;return function nlobjSublistGetter(record)
{var getSublist=function(name){var sl=null;var v1Record=getRecordImplV1(record);if(!v1Record)
return sl;return v1Record.getSublist(name)||null;};if(!nlobjSubList)
{nlobjSubList=function nlobjSubList(name){var sl=getSublist(name);this.name=name;this.type=sl?sl.getType():null;this.label=null;this.hidden=false;this.display=true;};nlobjSubList.prototype.getName=function(){return this.name;};nlobjSubList.prototype.getType=function(){return this.type;};nlobjSubList.prototype.getLabel=function(){return this.label!=null?this.label:"";};nlobjSubList.prototype.isHidden=function(){return this.hidden;};nlobjSubList.prototype.isDisplay=function(){return this.display;};nlobjSubList.prototype.isChanged=function(){var sl=getSublist(this.name);return sl?sl.isChanged():false;};nlobjSubList.prototype.setLabel=function(label){throwLegacyUnsupportedError();};nlobjSubList.prototype.setHelpText=function(help){throwLegacyUnsupportedError();};nlobjSubList.prototype.setDisplayType=function(type){throwLegacyUnsupportedError();};nlobjSubList.prototype.setLineItemValue=function(field,line,value){throwLegacyUnsupportedError();};nlobjSubList.prototype.setLineItemMatrixValue=function(field,line,column,value){throwLegacyUnsupportedError();};nlobjSubList.prototype.setLineItemValues=function(values){throwLegacyUnsupportedError();};nlobjSubList.prototype.getField=function(name){throwLegacyUnsupportedError();};nlobjSubList.prototype.getAllFields=function(){throwLegacyUnsupportedError();};nlobjSubList.prototype.getAllHeaderFields=function(){throwLegacyUnsupportedError();};nlobjSubList.prototype.addField=function(name,type,label,source,group){throwLegacyUnsupportedError();};nlobjSubList.prototype.addHeaderField=function(name,type,label,source){throwLegacyUnsupportedError();};nlobjSubList.prototype.setAmountField=function(fldnam){throwLegacyUnsupportedError();};nlobjSubList.prototype.setUniqueField=function(fldnam){throwLegacyUnsupportedError();};nlobjSubList.prototype.getMatrixCount=function(field){throwLegacyUnsupportedError();};nlobjSubList.prototype.addButton=function(name,label,script){throwLegacyUnsupportedError();};nlobjSubList.prototype.getButton=function(name){throwLegacyUnsupportedError();};nlobjSubList.prototype.addRefreshButton=function(){throwLegacyUnsupportedError();};nlobjSubList.prototype.addMarkAllButtons=function(){throwLegacyUnsupportedError();};}
return nlobjSubList;};})();var nlobjSublistWrapper=function(record,sublist)
{if(!sublist)return sublist;var nlobjsublist=new(nlobjSublistGetter(record))(sublist.getName());nlobjsublist.type=sublist.getType();nlobjsublist.hidden=!!sublist.isHidden();nlobjsublist.display=!!sublist.isDisplay();return nlobjsublist;};var nlobjFieldGetter=(function()
{var nlobjField;return function nlobjFieldGetter(record)
{var getField=function(name,sublist,line_1)
{var fld=null;var v1Record=getRecordImplV1(record);if(!v1Record)
return fld;if(sublist){fld=v1Record.getLineItemField(sublist,name,line_1);}
else{fld=v1Record.getField(name);}
return fld;};if(!nlobjField)
{nlobjField=function nlobjField(name,type,sublist){this.name=name;this.type=type;this.noslaving=false;this.sublist=sublist;this.label=null;this.required=false;this.disabled=false;this.hidden=false;this.display=false;this.visible=false;this.popup=false;this.readonly=false;this.parent=null;this.uifield=null;this.linenum=-1;};nlobjField.prototype.getName=function(){return this.name;};nlobjField.prototype.getType=function(){return this.type;};nlobjField.prototype.getLabel=function(){return this.label!=null?this.label:""};nlobjField.prototype.getSubList=function(){return this.sublist;};nlobjField.prototype.getParent=function(){return this.parent;};nlobjField.prototype.getLine=function(){return this.linenum;};nlobjField.prototype.getUIField=function(){return this.uifield;};nlobjField.prototype.noSlaving=function(){return this.noslaving;};nlobjField.prototype.isMandatory=function(){return this.required;};nlobjField.prototype.isDisabled=function(){return this.disabled;};nlobjField.prototype.isHidden=function(){return this.hidden;};nlobjField.prototype.isPopup=function(){return this.popup;};nlobjField.prototype.isDisplay=function(){return this.display;};nlobjField.prototype.isVisible=function(){return this.visible;};nlobjField.prototype.isReadOnly=function(){return this.readonly;};nlobjField.DISPLAY_TYPE={INLINE:'inline',HIDDEN:'hidden',READ_ONLY:'readonly',ENTRY:'entry',DISABLED:'disabled',NORMAL:'normal'};nlobjField.prototype.setDisplayType=function(displayType){checkArgs([displayType],['displayType'],'nlobjField.setDisplayType');console.log('setDisplayType: '+displayType);var fld=getField(this.name,this.sublist,this.line);if(!fld)
return;switch(displayType.toLowerCase()){case nlobjField.DISPLAY_TYPE.INLINE:throwLegacyUnsupportedError();break;case nlobjField.DISPLAY_TYPE.HIDDEN:fld.setDisplay(false);fld.setVisible(false);this.hidden=true;this.visible=false;this.display=false;break;case nlobjField.DISPLAY_TYPE.READ_ONLY:if(!this.type||this.type!=="textarea")
return;fld.setDisabled(true);this.disabled=true;break;case nlobjField.DISPLAY_TYPE.ENTRY:if(this.hidden||this.disabled)
return;fld.setDisabled(false);fld.setDisplay(true);fld.setVisible(true);this.hidden=false;this.visible=true;this.display=true;this.disabled=false;break;case nlobjField.DISPLAY_TYPE.DISABLED:fld.setDisabled(true);this.disabled=true;break;case nlobjField.DISPLAY_TYPE.NORMAL:fld.setDisabled(false);fld.setDisplay(true);fld.setVisible(true);this.hidden=false;this.visible=true;this.display=true;this.disabled=false;break;default:break;}};nlobjField.prototype.setLabel=function(required){throwLegacyUnsupportedError();};nlobjField.prototype.setAlias=function(required){throwLegacyUnsupportedError();};nlobjField.prototype.setDefaultValue=function(required){throwLegacyUnsupportedError();};nlobjField.prototype.setDisabled=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setMandatory=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setMaxLength=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setLayoutType=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setLinkText=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setHelpText=function(text){throwLegacyUnsupportedError();};nlobjField.prototype.setDisplaySize=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.setPadding=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.addSelectOption=function(disabled){throwLegacyUnsupportedError();};nlobjField.prototype.getSelectOptions=function(token){throwLegacyUnsupportedError();};}
return nlobjField;}})();var nlobjFieldWrapper=function(record,field,linenum)
{if(!field)return field;var fieldState=record&&record.hasOwnProperty("getFieldState")?record.getFieldState(field.getName()):null;var nlobjfield=new(nlobjFieldGetter(record))(field.getName(),field.getType(),field.getSublistName());nlobjfield.noslaving=field.noSlaving();nlobjfield.label=field.getLabel();nlobjfield.required=field.isMandatory();nlobjfield.disabled=field.isDisabled();nlobjfield.hidden=(fieldState&&fieldState.isHidden)||false;nlobjfield.display=field.isDisplay();nlobjfield.visible=field.isVisible();nlobjfield.popup=field.isPopup();nlobjfield.readonly=field.isReadOnly();nlobjfield.parent=null;nlobjfield.uifield=null;nlobjfield.linenum=linenum!=null?linenum:-1;return nlobjfield;};var nlobjErrorGetter=(function()
{var nlobjError;return function nlobjErrorGetter()
{function stacktrace()
{var stackstring="stacktrace: ";var history=[];var func=arguments.callee.caller;while(func!=null)
{var funcName=getFuncName(func);var funcArgs=getFuncArgs(func);var caller=func.caller;var infiniteLoopDetected=history.indexOf(funcName)!==-1;var historyTooLong=history.length>50;var callerIsSelf=(caller===func);if(infiniteLoopDetected||historyTooLong||callerIsSelf)
break;stackstring+=funcName+funcArgs+"\n\n";history.push(funcName);func=caller;}
return stackstring;}
function getFuncArgs(a)
{var s="arguments: {";for(var i=0;i<a.arguments.length;i++)
{if(typeof a.arguments[i]=="undefined")
s+='\'undefined\'';else if(a.arguments[i]==null)
s+='null';else if(typeof a.arguments[i]=="string")
s+="'"+a.arguments[i].toString()+"'";else
s+=a.arguments[i].toString();if(i<a.arguments.length-1)
s+=",";}
s+="}";return s;}
function getFuncName(f)
{var s=f.toString();if(s.indexOf("anonymous")>=0)
{if(s.length>100)
return s.substr(0,100)+"\n";else
return s+"\n";}
else
{s=s.match(/function[^{]*/);if(s!==null)
s=s[0];}
if((s==null)||(s.length==0))return "anonymous \n";return s;}
if(!nlobjError)
{nlobjError=function nlobjError(code,error,suppressnotification)
{this.id=null;this.code=code;this.details=error;this.stacktrace=stacktrace();this.suppressnotification=suppressnotification;if(code instanceof nlobjError)
{this.id=code.getId();this.code=code.getCode();this.details=code.getDetails();this.stacktrace=code.getStackTrace();}
this.name=this.code;this.message=this.details;this.description=this.details;};nlobjError.prototype.getId=function(){return this.id;};nlobjError.prototype.getCode=function(){return this.code;};nlobjError.prototype.getDetails=function(){return this.details;};nlobjError.prototype.getStackTrace=function(){return this.stacktrace;};}
return nlobjError;}})();var nlobjErrorWrapper=function(exception)
{return exception&&exception.hasOwnProperty('notifyOff')?new(nlobjErrorGetter())(exception.name,exception.message,exception.notifyOff):exception;};nlobjErrorWrapper.wrapEmitLegacyError=function(func)
{var fun=func;return function()
{try{return fun.apply(this,arguments);}
catch(e)
{throw nlobjErrorWrapper(e);}}};function throwLegacyError(code,error,suppressnotification){throw new(nlobjErrorGetter())(code,error,suppressnotification);}
function throwLegacyUnsupportedError(){throwLegacyError('SSS_NOT_YET_SUPPORTED');}
var assertTrue=nlobjErrorWrapper.wrapEmitLegacyError(utilityFunctions.assertTrue);var checkArgs=nlobjErrorWrapper.wrapEmitLegacyError(utilityFunctions.checkArgs);var nonRecordV1Functions=function(){function createRecord(type,initializeValues)
{var options={type:type,defaultValues:initializeValues};return nlobjRecordWrapper(getRecordImplModule().create_raw(options),'createRecord',options);}
this.createRecord=nlobjErrorWrapper.wrapEmitLegacyError(createRecord);function copyRecord(type,id,initializeValues)
{var options={type:type,id:id,defaultValues:initializeValues};return nlobjRecordWrapper(getRecordImplModule().copy_raw(options),'copyRecord',options);}
this.copyRecord=nlobjErrorWrapper.wrapEmitLegacyError(copyRecord);function loadRecord(type,id,initializeValues)
{var options={type:type,id:id,defaultValues:initializeValues};return nlobjRecordWrapper(getRecordImplModule().load_raw(options),'loadRecord',options);}
this.loadRecord=nlobjErrorWrapper.wrapEmitLegacyError(loadRecord);function transformRecord(type,id,transformType,transformValues)
{var options={fromType:type,fromId:id,toType:transformType,defaultValues:transformValues};return nlobjRecordWrapper(getRecordImplModule().transform_raw(options),'transformRecord',options);}
this.transformRecord=nlobjErrorWrapper.wrapEmitLegacyError(transformRecord);function deleteRecord(type,id)
{var options={type:type,id:id};getRecordModule()['delete'](options);}
this.deleteRecord=nlobjErrorWrapper.wrapEmitLegacyError(deleteRecord);function submitField(type,id,fields,values,doSourcing)
{checkArgs([type,id,fields],['type','id','fields'],'nlapiSubmitField');try
{var valuesObj={};var flds=util.isArray(fields)?fields:[fields];var vals=util.isArray(values)?values:[values];for(var i=0;i<flds.length;i++)
valuesObj[flds[i]]=vals[i];var options={type:type,id:id,values:valuesObj,enableSourcing:doSourcing};getRecordModule().submitFields(options);}
catch(e)
{throw nlobjErrorWrapper(e.constructor.name==='SuiteScriptError'?e:utilityFunctions.createSuiteScriptError(e));}}
this.submitField=nlobjErrorWrapper.wrapEmitLegacyError(submitField);function attachRecord(type,id,type2,id2,attributes)
{var options={record:{type:type,id:id},to:{type:type2,id:id2},attributes:attributes};getRecordModule().attach(options);}
this.attachRecord=nlobjErrorWrapper.wrapEmitLegacyError(attachRecord);function detachRecord(type,id,type2,id2,attributes)
{var options={record:{type:type,id:id},from:{type:type2,id:id2},attributes:attributes};getRecordModule().detach(options);}
this.detachRecord=nlobjErrorWrapper.wrapEmitLegacyError(detachRecord);function submitRecord(nlobjRecord,options,ignoreMandatoryFields)
{checkArgs([nlobjRecord],['nlobjRecord'],'nlapiSubmitRecord');if(nlobjRecord.constructor.name!=='nlobjRecord')
throwLegacyError('SSS_INVALID_RECORD_OBJ','The record is not a valid object.');try
{var attributes={'enableSourcing':""+(options===true||(!!options&&options.enableSourcing===true)),'disableTriggers':""+(!!options&&options.disableTriggers===true),'ignoreMandatoryFields':""+(ignoreMandatoryFields===true||(!!options&&options.ignoreMandatoryFields===true))};var recordData=JSON.stringify({attributes:attributes,type:nlobjRecord.type,id:nlobjRecord.id,load:nlobjRecord.operations[0],operations:Array.prototype.slice.call(nlobjRecord.operations,1)});var sKey=invoker(remoteApi,'submitLegacyRecord',[recordData]);return sKey;}
catch(e)
{throw nlobjErrorWrapper(e.constructor.name==='SuiteScriptError'?e:utilityFunctions.createSuiteScriptError(e));}}
this.submitRecord=nlobjErrorWrapper.wrapEmitLegacyError(submitRecord);return Object.freeze(this);};var nlobjWrappers=Object.freeze({nlobjRecordWrapper:nlobjRecordWrapper,nlobjSublistWrapper:nlobjSublistWrapper,nlobjFieldWrapper:nlobjFieldWrapper,nlobjErrorWrapper:nlobjErrorWrapper});var nlobjGetters=Object.freeze({nlobjRecordGetter:nlobjRecordGetter,nlobjSublistGetter:nlobjSublistGetter,nlobjFieldGetter:nlobjFieldGetter,nlobjErrorGetter:nlobjErrorGetter});return{nonRecordV1Functions:new(nonRecordV1Functions),nlobjWrappers:nlobjWrappers,nlobjGetters:nlobjGetters};});define('N/record/recordImplV1Util',['N/error','N/utilityFunctions','N/record/recordUtilityFunctions','N/restricted/invoker','N/restricted/remoteApiBridge','N/record/sublist','N/record/legacyNLObjects'],function(error,utilityFunctions,recordUtil,invoker,remoteApi,sublist,legacyNLObjects){function RecordImplV1(record,subrecordControllerV1)
{var undef=undefined;this.nonRecordV1Functions=legacyNLObjects.nonRecordV1Functions;this.nlobjects={nlobjRecordWrapper:legacyNLObjects.nlobjWrappers.nlobjRecordWrapper,nlobjSublistWrapper:legacyNLObjects.nlobjWrappers.nlobjSublistWrapper.bind(null,record),nlobjFieldWrapper:legacyNLObjects.nlobjWrappers.nlobjFieldWrapper.bind(null,record),nlobjErrorWrapper:legacyNLObjects.nlobjWrappers.nlobjErrorWrapper,nlobjRecordGetter:legacyNLObjects.nlobjGetters.nlobjRecordGetter,nlobjSublistGetter:legacyNLObjects.nlobjGetters.nlobjSublistGetter.bind(null,record),nlobjFieldGetter:legacyNLObjects.nlobjGetters.nlobjFieldGetter.bind(null,record),nlobjErrorGetter:legacyNLObjects.nlobjGetters.nlobjErrorGetter};var wrapEmitLegacyError=legacyNLObjects.nlobjWrappers.nlobjErrorWrapper.wrapEmitLegacyError;function getDelegate()
{return record;}
this.getDelegate=wrapEmitLegacyError(getDelegate);function getId()
{return record.id;}
this.getId=wrapEmitLegacyError(getId);function getRecordType()
{return record.getRecordType();}
this.getRecordType=wrapEmitLegacyError(getRecordType);function fixNullEmptyBug()
{return true;}
function removeField(fieldId)
{return record.doRemoveField(fieldId);}
this.removeField=wrapEmitLegacyError(removeField);function removeLineItemField(sublistId,fieldId,line_1)
{}
this.removeLineItemField=wrapEmitLegacyError(removeLineItemField);function getFieldValue(fieldId)
{var value;var subrecordRedirect=record.getSubrecordRedirect(null,fieldId);if(!!subrecordRedirect)
{var subrecord=subrecordControllerV1.getUncommittedSubrecord(null,subrecordRedirect.subrecordFieldId,-1);if(!!subrecord)
{value=subrecord.getValueAsLegacyString(subrecordRedirect.fieldId);}
else if(record.hasSubrecord(subrecordRedirect.subrecordFieldId))
{subrecord=record.doGetBodySubrecord(subrecordRedirect.subrecordFieldId);value=subrecord.getValueAsLegacyString(subrecordRedirect.fieldId);}
else
value="";}
else
{value=record.getValueAsLegacyString(fieldId);value=fixNullEmptyBug()?recordUtil.emptyIfNullOrUndefined(value):value;}
return value;}
this.getFieldValue=wrapEmitLegacyError(getFieldValue);this.nlapiGetFieldValue=wrapEmitLegacyError(getFieldValue);function getFieldText(fieldId)
{var returnText="";var isMultiSelect=record.isFieldMultiSelect(null,fieldId);if(record.isFieldSelectType(null,fieldId)||isMultiSelect)
{var value=record.getValue(fieldId);if(!utilityFunctions.isEmpty(value))
{var useBuffer=true;returnText=record.doGetTextValueForSelectFieldForInstance(null,fieldId,value,null,useBuffer,isMultiSelect);}}
return returnText;}
this.getFieldText=wrapEmitLegacyError(getFieldText);function getFieldValues(fieldId)
{var value=null;if(record.isFieldMultiSelect(null,fieldId))
{value=record.getValueAsLegacyStringArray(fieldId);value=(value)?value:(fixNullEmptyBug()?[]:null);}
return value;}
this.getFieldValues=wrapEmitLegacyError(getFieldValues);function getFieldTexts(fieldId)
{var value=null;if(record.isFieldMultiSelect(null,fieldId))
{value=record.getText(fieldId);value=(value)?value:(fixNullEmptyBug()?[]:null);}
return value;}
this.getFieldTexts=wrapEmitLegacyError(getFieldTexts);function setFieldValue(fieldId,value,fireFieldChange,noSlaving)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;var subrecordRedirect=record.getSubrecordRedirect(null,fieldId);if(!!subrecordRedirect)
{var subrecord=subrecordControllerV1.getUncommittedSubrecord(null,subrecordRedirect.subrecordFieldId,-1);if(!!subrecord)
{subrecord.setFieldValue(subrecordRedirect.fieldId,value,fireFieldChange,noSlaving);}
subrecord=record.doGetBodySubrecord(subrecordRedirect.subrecordFieldId);subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value});}
else
{record.setFieldValue(fieldId,value,fireFieldChange,noSlaving);}}
this.setFieldValue=wrapEmitLegacyError(setFieldValue);function setFieldText(fieldId,text,fireFieldChange)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;record.setFieldtext(fieldId,text,fireFieldChange);}
this.setFieldText=wrapEmitLegacyError(setFieldText);function setFieldValues(fieldId,values,fireFieldChange,noSlaving)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;var subrecordRedirect=record.getSubrecordRedirect(null,fieldId);if(!!subrecordRedirect)
{var subrecord=subrecordControllerV1.getUncommittedSubrecord(null,subrecordRedirect.subrecordFieldId,-1);if(!!subrecord)
{subrecord.setFieldValues(subrecordRedirect.fieldId,values,fireFieldChange,noSlaving);}
subrecord=record.doGetBodySubrecord(subrecordRedirect.subrecordFieldId);subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:values});}
else
{record.setFieldValues(fieldId,values,fireFieldChange,noSlaving);}}
this.setFieldValues=wrapEmitLegacyError(setFieldValues);function setFieldTexts(fieldId,texts,fireFieldChange)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;record.setFieldTexts(fieldId,texts,fireFieldChange);}this.setFieldTexts=wrapEmitLegacyError(setFieldTexts);function calculateGetDateTimeWithTimeZone(dateTime,timeZone)
{var context=invoker(remoteApi,"nlapiGetContext",[]);if(dateTime&&context.getPreference("TIMEZONE")!==timeZone)
{dateTime=invoker(remoteApi,'calculateGetDateTimeWithTimeZone',[dateTime,timeZone]);}
return dateTime;}
function calculateSetDateTimeWithNewTimeZone(dateTime,timeZone)
{var context=invoker(remoteApi,"nlapiGetContext",[]);if(dateTime&&context.getPreference("TIMEZONE")!==timeZone)
{dateTime=invoker(remoteApi,'calculateSetDateTimeWithNewTimeZone',[dateTime,timeZone]);}
return dateTime;}
function getDateTimeValue(fieldId,timezone)
{var dateTime=getFieldValue(fieldId);return calculateGetDateTimeWithTimeZone(dateTime,timezone);}
this.getDateTimeValue=wrapEmitLegacyError(getDateTimeValue);function setDateTimeValue(fieldId,value,timezone)
{value=calculateSetDateTimeWithNewTimeZone(value,timezone);return setFieldValue(fieldId,value);}
this.setDateTimeValue=wrapEmitLegacyError(setDateTimeValue);function _getSubrecordBackwardCompatibilityMap(sublistId)
{return(record.getSublistMetadata(sublistId)||{}).backwardCompatibilityFieldNamesForSubrecord;}
this._getSubrecordBackwardCompatibilityMap=wrapEmitLegacyError(_getSubrecordBackwardCompatibilityMap);function getLineItemValue(sublistId,fieldId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);var value;if((record.getSublistFields(sublistId)||[]).indexOf(fieldId)===-1)
{var backwardCompatibilityMap=_getSubrecordBackwardCompatibilityMap(sublistId)||[];if(backwardCompatibilityMap.indexOf(fieldId)>-1)
fieldId=fieldId+'_initialvalue';}
value=record.getSublistLineValueAsLegacyString(sublistId,fieldId,line_0);value=fixNullEmptyBug()?recordUtil.emptyIfNullOrUndefined(value):value;return value;}
this.getLineItemValue=wrapEmitLegacyError(getLineItemValue);function getLineItemText(sublistId,fieldId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);var returnText="";if(record.isFieldSelectType(sublistId,fieldId))
{if(record.isFieldMultiSelect(sublistId,fieldId))
{var values=getLineItemTexts(sublistId,fieldId,line_0);returnText=values.join(",");}
else
{returnText=record.getSublistText(sublistId,fieldId,line_0);}}
return returnText;}
this.getLineItemText=wrapEmitLegacyError(getLineItemText);function getLineItemValues(sublistId,fieldId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);var value=null;if(record.isFieldMultiSelect(sublistId,fieldId))
{value=getLineItemValue(sublistId,fieldId,line_0);value=fixNullEmptyBug()?recordUtil.emptyIfNullOrUndefined(value):value;}
return value;}
this.getLineItemValues=wrapEmitLegacyError(getLineItemValues);function getLineItemTexts(sublistId,fieldId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);var texts=null;if(record.isFieldMultiSelect(sublistId,fieldId))
{texts=record.getSublistText(sublistId,fieldId,line_0);texts=(texts)?texts:(fixNullEmptyBug()?[]:null);}
return texts;}
this.getLineItemTexts=wrapEmitLegacyError(getLineItemTexts);function setLineItemValue(sublistId,fieldId,line_1,value)
{if(record.isSublistValid(sublistId))
{recordUtil.validateAgainstSqlInjection(fieldId,value);var line_0=recordUtil.getZeroBasedIndex(line_1);var autosetCurrentLine=record.isDynamic&&record.doGetCurrentSublistIndex(sublistId)==line_1&&record.isSublistAListMachine(sublistId);var subrecordRedirect=record.getSubrecordRedirect(sublistId,fieldId);var subrecord;var fireFieldChange=false;value=recordUtil.emptyIfNullOrUndefined(value);if(record.getSublistMetadata(sublistId).displayOnly)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_SCRIPT_OPERATION_ON_READONLY_SUBLIST_FIELD,sublistId);if(record.isSublistAnEditMachine(sublistId)&&line_0===record.getModelController().getNewLineIndex(sublistId))
record.doInsertLine(sublistId,line_0);record.validateLineIndex_MLB(line_0,sublistId,true);if(!!subrecordRedirect)
{subrecord=subrecordControllerV1.getUncommittedSubrecord(sublistId,subrecordRedirect.subrecordFieldId,line_0);if(!!subrecord)
{subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value,fireFieldChange:fireFieldChange});}
subrecord=record.doGetSublistSubrecord(sublistId,subrecordRedirect.subrecordFieldId,line_0);subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value,fireFieldChange:fireFieldChange});if(autosetCurrentLine)
{subrecord=subrecordControllerV1.getUncommittedSubrecord(sublistId,subrecordRedirect.subrecordFieldId);if(!!subrecord)
{subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value,fireFieldChange:fireFieldChange});}
var currentSubrecord=record.doGetCurrentSublistSubrecord(sublistId,subrecordRedirect.subrecordFieldId);currentSubrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value,fireFieldChange:fireFieldChange});}}
else
{record.setLineItemValue(sublistId,fieldId,line_0,value);if(autosetCurrentLine)
setCurrentLineItemValue(sublistId,fieldId,value,false);}}}
this.setLineItemValue=wrapEmitLegacyError(setLineItemValue);function getCurrentLineItemValue(sublistId,fieldId)
{var value;if((record.getSublistFields(sublistId)||[]).indexOf(fieldId)===-1)
{var backwardCompatibilityMap=((record.getSublistMetadata(sublistId)||{}).backwardCompatibilityFieldNamesForSubrecord||[]);if(backwardCompatibilityMap.indexOf(fieldId)>-1)
fieldId=fieldId+'_initialvalue';}
value=record.getCurrentSublistLineValueAsLegacyString(sublistId,fieldId);value=recordUtil.emptyIfNullOrUndefined(value);return value;}
this.getCurrentLineItemValue=wrapEmitLegacyError(getCurrentLineItemValue);function getCurrentLineItemText(sublistId,fieldId)
{var returnText="";if(record.isFieldSelectType(sublistId,fieldId))
{if(record.isFieldMultiSelect(sublistId,fieldId))
{var values=getCurrentLineItemTexts(sublistId,fieldId);returnText=values.join(",");}
else
{returnText=record.getCurrentSublistText(sublistId,fieldId);}}
return returnText;}
this.getCurrentLineItemText=wrapEmitLegacyError(getCurrentLineItemText);function getCurrentLineItemValues(sublistId,fieldId)
{if(record.isFieldMultiSelect(sublistId,fieldId))
{var value=getCurrentLineItemValue(sublistId,fieldId);return recordUtil.formatValueToArrayType(value);}}
this.getCurrentLineItemValues=wrapEmitLegacyError(getCurrentLineItemValues);function getCurrentLineItemTexts(sublistId,fieldId)
{var texts=null;if(record.isFieldMultiSelect(sublistId,fieldId))
{texts=record.getCurrentSublistText(sublistId,fieldId);texts=(texts)?texts:(fixNullEmptyBug()?[]:null);}
return texts;}
this.getCurrentLineItemTexts=wrapEmitLegacyError(getCurrentLineItemTexts);function setCurrentLineItemValue(sublistId,fieldId,value,fireFieldChange)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;var subrecordRedirect=record.getSubrecordRedirect(sublistId,fieldId);if(!!subrecordRedirect)
{var subrecord=subrecordControllerV1.getUncommittedSubrecord(sublistId,subrecordRedirect.subrecordFieldId,-1);if(!!subrecord)
{subrecord.setFieldValue(subrecordRedirect.fieldId,value,fireFieldChange);}
subrecord=record.doGetBodySubrecord(subrecordRedirect.subrecordFieldId);subrecord.setValue({fieldId:subrecordRedirect.fieldId,value:value});}
else
{record.setCurrentLineItemValue(sublistId,fieldId,value,fireFieldChange);}}
this.setCurrentLineItemValue=wrapEmitLegacyError(setCurrentLineItemValue);function setCurrentLineItemValues(sublistId,fieldId,values,fireFieldChange)
{setCurrentLineItemValue(sublistId,fieldId,values!=null?values.join(String.fromCharCode(5)):"",fireFieldChange);}
this.setCurrentLineItemValues=wrapEmitLegacyError(setCurrentLineItemValues);function setCurrentLineItemText(sublistId,fieldId,text,fireFieldChange)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;record.setCurrentLineItemText(sublistId,fieldId,text,fireFieldChange)}
this.setCurrentLineItemText=wrapEmitLegacyError(setCurrentLineItemText);function getCurrentLineItemDateTimeValue(sublistId,fieldId,timeZone)
{var dateTime=getCurrentLineItemValue(sublistId,fieldId);return calculateGetDateTimeWithTimeZone(dateTime,timeZone);}
this.getCurrentLineItemDateTimeValue=wrapEmitLegacyError(getCurrentLineItemDateTimeValue);function setCurrentLineItemDateTimeValue(sublistId,fieldId,dateTime,timeZone)
{dateTime=calculateSetDateTimeWithNewTimeZone(dateTime,timeZone);return setCurrentLineItemValue(sublistId,fieldId,dateTime);}
this.setCurrentLineItemDateTimeValue=wrapEmitLegacyError(setCurrentLineItemDateTimeValue);function getLineItemDateTimeValue(sublistId,fieldId,line,timeZone)
{var dateTime=getLineItemValue(sublistId,fieldId,line);return calculateGetDateTimeWithTimeZone(dateTime,timeZone);}
this.getLineItemDateTimeValue=wrapEmitLegacyError(getLineItemDateTimeValue);function setLineItemDateTimeValue(sublistId,fieldId,lineNum,dateTime,timeZone)
{dateTime=calculateSetDateTimeWithNewTimeZone(dateTime,timeZone);return setLineItemValue(sublistId,fieldId,lineNum,dateTime);}
this.setLineItemDateTimeValue=wrapEmitLegacyError(setLineItemDateTimeValue);function getCurrentLineItemIndex(sublistId)
{return recordUtil.getOneBasedIndex(record.doGetCurrentSublistIndex(sublistId));}
this.getCurrentLineItemIndex=wrapEmitLegacyError(getCurrentLineItemIndex);function lineItemIsChanged(type){var useBuffer=true;var isChanged=false;var line=record.doGetCurrentSublistIndex(type);(record.getSublistFields(type)||[]).forEach(function(fld){isChanged|=record.getSublistFieldState(type,fld,line,useBuffer).isChanged;});return!!isChanged;}
this.lineItemIsChanged=wrapEmitLegacyError(lineItemIsChanged);function getSublistType(sublistId){return record.getSublistType(sublistId);}
this.getSublistType=wrapEmitLegacyError(getSublistType);function getV1Sublist(sublistId)
{var sublistLevelMetadata=record.getSublistMetadata(sublistId);return(sublistLevelMetadata!=null)?sublist.newInstanceOfV1Sublist({type:sublistLevelMetadata.nlobjSublistConstructorType,sublistState:record.getSublistState(sublistId),sublistFields:sublistLevelMetadata.fieldMetadata}):null;}
this.getV1Sublist=wrapEmitLegacyError(getV1Sublist);function getSublist(sublistId)
{return getV1Sublist(sublistId);}
this.getSublist=wrapEmitLegacyError(getSublist);function getLineItemCount(sublistId)
{return record.doGetLineCount(sublistId);}
this.getLineItemCount=wrapEmitLegacyError(getLineItemCount);function findLineItemValue(sublistId,fieldId,value)
{var index=record.doFindSublistLineWithValue(sublistId,fieldId,value);return recordUtil.getOneBasedIndex(index);}
this.findLineItemValue=wrapEmitLegacyError(findLineItemValue);function findLineItemMatrixValue(options,fieldId,column_1,value)
{var column_0=recordUtil.getZeroBasedIndex(column_1);var index=record.findMatrixSublistLineWithValue(options,fieldId,column_0,value);return recordUtil.getOneBasedIndex(index);}
this.findLineItemMatrixValue=wrapEmitLegacyError(findLineItemMatrixValue);function getMatrixField(options,fieldId,column_1)
{var column_0=recordUtil.getZeroBasedIndex(column_1);return record.getMatrixHeaderField(options,fieldId,column_0);}
this.getMatrixField=wrapEmitLegacyError(getMatrixField);function getMatrixCount(options,fieldId)
{return record.getMatrixHeaderCount(options,fieldId);}
this.getMatrixCount=wrapEmitLegacyError(getMatrixCount);function getMatrixValue(options,fieldId,column_1)
{var column_0=recordUtil.getZeroBasedIndex(column_1);return record.getMatrixHeaderValue(options,fieldId,column_0);}
this.getMatrixValue=wrapEmitLegacyError(getMatrixValue);function setMatrixValue(options,fieldId,column_1,value,fireFieldChange)
{fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;var column_0=recordUtil.getZeroBasedIndex(column_1);return record.setMatrixHeaderValue(options,fieldId,column_0,value,!fireFieldChange);}
this.setMatrixValue=wrapEmitLegacyError(setMatrixValue);function getLineItemMatrixField(sublistId,fieldId,line_1,column_1)
{if(!column_1)
{column_1=line_1;line_1=-1;}
var column_0=recordUtil.getZeroBasedIndex(column_1);var line_0=recordUtil.getZeroBasedIndex(line_1);return record.getMatrixSublistField(sublistId,fieldId,line_0,column_0);}
this.getLineItemMatrixField=wrapEmitLegacyError(getLineItemMatrixField);function getLineItemMatrixValue(sublistId,fieldId,line_1,column_1)
{var column_0=recordUtil.getZeroBasedIndex(column_1);var line_0=recordUtil.getZeroBasedIndex(line_1);return record.getMatrixSublistValue(sublistId,fieldId,line_0,column_0);}
this.getLineItemMatrixValue=wrapEmitLegacyError(getLineItemMatrixValue);function setLineItemMatrixValue(sublistId,fieldId,line_1,column_1,value)
{var column_0=recordUtil.getZeroBasedIndex(column_1);var line_0=recordUtil.getZeroBasedIndex(line_1);return record.setMatrixSublistValue(sublistId,fieldId,line_0,column_0,value);}
this.setLineItemMatrixValue=wrapEmitLegacyError(setLineItemMatrixValue);function getCurrentLineItemMatrixValue(sublistId,fieldId,column_1)
{var column_0=recordUtil.getZeroBasedIndex(column_1);return record.getCurrentMatrixSublistValue(sublistId,fieldId,column_0);}
this.getCurrentLineItemMatrixValue=wrapEmitLegacyError(getCurrentLineItemMatrixValue);function setCurrentLineItemMatrixValue(sublistId,fieldId,column_1,value,fireFieldChange)
{var column_0=recordUtil.getZeroBasedIndex(column_1);fireFieldChange=util.isBoolean(fireFieldChange)?fireFieldChange:fireFieldChange||true;return record.setCurrentMatrixSublistValue(sublistId,fieldId,column_0,value,!fireFieldChange);}
this.setCurrentLineItemMatrixValue=wrapEmitLegacyError(setCurrentLineItemMatrixValue);function selectNewLineItem(sublistId,ignoreLineInit)
{var lineObj=record.doSelectNewLine(sublistId,ignoreLineInit);subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);return lineObj;}
this.selectNewLineItem=wrapEmitLegacyError(selectNewLineItem);function selectLineItem(sublistId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);var lineObj=record.doSelectLine(sublistId,line_0);subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);return lineObj;}
this.selectLineItem=wrapEmitLegacyError(selectLineItem);function insertLineItem(sublistId,line_1,ignoreRecalc)
{if(!line_1)
{line_1=getCurrentLineItemIndex(sublistId);}
var line_0=recordUtil.getZeroBasedIndex(line_1);record.doInsertLine(sublistId,line_0,ignoreRecalc);subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.insertLineItem=wrapEmitLegacyError(insertLineItem);function removeLineItem(sublistId,line_1,ignoreRecalc)
{if(!line_1)
{line_1=getCurrentLineItemIndex(sublistId);}
var line_0=recordUtil.getZeroBasedIndex(line_1);record.doRemoveLine(sublistId,line_0,ignoreRecalc);subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.removeLineItem=wrapEmitLegacyError(removeLineItem);function cancelLineItem(sublistId)
{record.doCancelLine(sublistId);subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.cancelLineItem=wrapEmitLegacyError(cancelLineItem);function commitLineItem(sublistId,ignoreRecalc)
{record.doCommitLine(sublistId,ignoreRecalc);var sublistState=record.getSublistState(sublistId);if(!sublistState.allowsNewLine)
sublistState.resetCurrentLineState(record.getCurrentSublistIndex(sublistId));subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.commitLineItem=wrapEmitLegacyError(commitLineItem);function insertLineItemOption(type,fldnam,value,text,selected)
{utilityFunctions.assertTrue(type!=null&&fldnam!=null&&fldnam.indexOf('custpage')==0,'SSS_INVALID_OPERATION');var fld=getLineItemField(type,fldnam);if(fld&&fld.hasOwnProperty('insertSelectOption')&&!fld.isPopup())
fld.insertSelectOption(value,text,selected,true);}
this.insertLineItemOption=wrapEmitLegacyError(insertLineItemOption);function removeLineItemOption(type,fldnam,value)
{utilityFunctions.assertTrue(type!=null&&fldnam!=null&&fldnam.indexOf('custpage')==0,'SSS_INVALID_OPERATION');var fld=getLineItemField(type,fldnam);if(fld&&fld.hasOwnProperty('removeSelectOption')&&!fld.isPopup())
{if(value!=null)
fld.removeSelectOption(value,true);else
(fld.getSelectOptions()||[]).forEach(function(selectOption){fld.removeSelectOption(selectOption.getId())});}}
this.removeLineItemOption=wrapEmitLegacyError(removeLineItemOption);function insertSelectOption(fldnam,value,text,selected)
{utilityFunctions.assertTrue(fldnam!=null&&fldnam.indexOf('custpage')==0,'SSS_INVALID_OPERATION');var fld=getField(fldnam);if(fld&&fld.hasOwnProperty('insertSelectOption')&&!fld.isPopup())
fld.insertSelectOption(value,text,selected);}
this.insertSelectOption=wrapEmitLegacyError(insertSelectOption);function removeSelectOption(fldnam,value)
{utilityFunctions.assertTrue(fldnam!=null&&fldnam.indexOf('custpage')==0,'SSS_INVALID_OPERATION');var fld=getField(fldnam);if(fld&&fld.hasOwnProperty('removeSelectOption')&&!fld.isPopup())
{if(value!=null)
fld.removeSelectOption(value);else
(fld.getSelectOptions()||[]).forEach(function(selectOption){fld.removeSelectOption(selectOption.getId())});}}
this.removeSelectOption=wrapEmitLegacyError(removeSelectOption);function getField(fieldId)
{var sublistId=undef;var lineInstanceId=null;var useBuffer=false;return record.getCachedRecordField(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getField=wrapEmitLegacyError(getField);function getLineItemField(sublistId,fieldId,line_1)
{var line_0;if(line_1===undef||line_1===-1)
line_0=record.getCurrentSublistIndex(sublistId);else
line_0=recordUtil.getZeroBasedIndex(line_1);var useBuffer=line_0===record.getCurrentSublistIndex(sublistId);return(line_0===-1)?undef:record.getCachedRecordField(sublistId,fieldId,line_0,useBuffer);}
this.getLineItemField=wrapEmitLegacyError(getLineItemField);function getAllSublists()
{return record.getSublists()}
this.getAllSublists=wrapEmitLegacyError(getAllSublists);function getAllFields()
{return record.getFields();}
this.getAllFields=wrapEmitLegacyError(getAllFields);function getAllLineItemFields(sublistId)
{return record.getSublistFields(sublistId);}
this.getAllLineItemFields=wrapEmitLegacyError(getAllLineItemFields);function isDynamic()
{return record.isDynamic;}
this.isDynamic=wrapEmitLegacyError(isDynamic);function isChanged()
{return record.isChanged();}
this.isChanged=wrapEmitLegacyError(isChanged);function isInternal()
{return record.isInternal();}
this.isInternal=wrapEmitLegacyError(isInternal);function getFieldDisabled(fieldId)
{var field=getField(fieldId);if(field)
return field.isDisabled();}
this.getFieldDisabled=wrapEmitLegacyError(getFieldDisabled);function setFieldDisabled(fieldId,disable)
{var field=getField(fieldId);if(field)
field.setDisabled(disable);}
this.setFieldDisabled=wrapEmitLegacyError(setFieldDisabled);function getFieldMandatory(fieldId)
{var field=getField(fieldId);if(field)
return field.isMandatory();}
this.getFieldMandatory=wrapEmitLegacyError(getFieldMandatory);function setFieldMandatory(fieldId,mandatory)
{var field=getField(fieldId);if(field)
field.setMandatory(mandatory);}
this.setFieldMandatory=wrapEmitLegacyError(setFieldMandatory);function getFieldDisplay(fieldId)
{var field=getField(fieldId);if(field)
return field.isDisplay();}
this.getFieldDisplay=wrapEmitLegacyError(getFieldDisplay);function setFieldDisplay(fieldId,display)
{var field=getField(fieldId);if(field)
field.setDisplay(display);}
this.setFieldDisplay=wrapEmitLegacyError(setFieldDisplay);function getFieldVisibility(fieldId,visible)
{var field=getField(fieldId);if(field)
return field.isVisible(visible);}
this.getFieldVisibility=wrapEmitLegacyError(getFieldVisibility);function setFieldVisibility(fieldId,visible)
{var field=getField(fieldId);if(field)
field.setVisible(visible);}
this.setFieldVisibility=wrapEmitLegacyError(setFieldVisibility);function getFieldReadOnly(fieldId)
{var field=getField(fieldId);if(field)
return field.isReadOnly();}
this.getFieldReadOnly=wrapEmitLegacyError(getFieldReadOnly);function setFieldReadOnly(fieldId,readonly)
{var field=getField(fieldId);if(field)
field.setReadOnly(readonly);}
this.setFieldReadOnly=wrapEmitLegacyError(setFieldReadOnly);function getFieldLabel(fieldId)
{var field=getField(fieldId);if(field)
return field.getLabel();}
this.getFieldLabel=wrapEmitLegacyError(getFieldLabel);function setFieldLabel(fieldId,label)
{var field=getField(fieldId);if(field)
field.setLabel(label);}
this.setFieldLabel=wrapEmitLegacyError(setFieldLabel);function getLineItemDisplay(sublistId)
{var sublistState=record.getSublistState(sublistId);return(sublistState)?sublistState.isDisplay:false;}
this.getLineItemDisplay=wrapEmitLegacyError(getLineItemDisplay);function setLineItemDisplay(sublistId,display)
{var sublistState=record.getSublistState(sublistId);if(sublistState)
sublistState.isDisplay=display;}
this.setLineItemDisplay=wrapEmitLegacyError(setLineItemDisplay);function doGetSublistFieldState(sublistId,fieldId,line_1)
{var lineInstanceId;var useBuffer=false;if(record.isSublistAnEditMachine(sublistId))
{useBuffer=true;lineInstanceId=record.doGetCurrentSublistLineInstanceId(sublistId);}
else
{var line_0=recordUtil.getZeroBasedIndex(line_1);line_0=isNaN(line_0)?record.doGetCurrentSublistIndex(sublistId):line_0;useBuffer=line_0===record.doGetCurrentSublistIndex(sublistId);lineInstanceId=record.getModelController().getSublistLineInstanceIdForLine(sublistId,line_0,useBuffer)}
if(lineInstanceId===null&&record.isMultilineEditable(sublistId))
return null;else
return record.getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function getLineItemDisabled(sublistId,fieldId,line_1)
{var fieldState=doGetSublistFieldState(sublistId,fieldId,line_1);return(fieldState)?fieldState.isDisabled:false;}
this.getLineItemDisabled=wrapEmitLegacyError(getLineItemDisabled);function setLineItemDisabled(sublistId,fieldId,disabled,line_1)
{var fieldState=doGetSublistFieldState(sublistId,fieldId,line_1);if(fieldState)
fieldState.isDisabled=disabled;}
this.setLineItemDisabled=wrapEmitLegacyError(setLineItemDisabled);function getLineItemMandatory(sublistId,fieldId,line_1)
{var fieldState=doGetSublistFieldState(sublistId,fieldId,line_1);return(fieldState)?fieldState.isMandatory:false;}
this.getLineItemMandatory=wrapEmitLegacyError(getLineItemMandatory);function setLineItemMandatory(sublistId,fieldId,mandatory,line_1)
{var fieldState=doGetSublistFieldState(sublistId,fieldId,line_1);if(fieldState)
fieldState.isMandatory=mandatory;}
this.setLineItemMandatory=wrapEmitLegacyError(setLineItemMandatory);function getLineItemLabel(sublistId,fieldId)
{var useBuffer=true;var field=record.getCachedRecordField(sublistId,fieldId,record.doGetCurrentSublistIndex(sublistId),useBuffer);return field?field.getLabel():null;}
this.getLineItemLabel=wrapEmitLegacyError(getLineItemLabel);function setLineItemLabel(sublistId,fieldId,label)
{var useBuffer=true;var field=record.getCachedRecordField(sublistId,fieldId,record.doGetCurrentSublistIndex(sublistId),useBuffer);if(field)
field.setLabel(label);}
this.setLineItemLabel=wrapEmitLegacyError(setLineItemLabel);function handleChangeCall(params)
{record.handleChangeCall(params);invalidateSubrecordCacheForV1RecordScope();}
this.handleChangeCall=wrapEmitLegacyError(handleChangeCall);function triggerFieldChangeEvent(sublistId,fieldId,line,value,noSlaving)
{record.triggerFieldChangeEvent(sublistId,fieldId,line,value,noSlaving);}
this.triggerFieldChangeEvent=wrapEmitLegacyError(triggerFieldChangeEvent);function doSlaving(sublistId,fieldId,value,noSlaving,restrictField)
{record.doSlaving(sublistId,fieldId,value,noSlaving,restrictField);}
this.doSlaving=wrapEmitLegacyError(doSlaving);function invalidateSubrecordCacheForV1RecordScope()
{subrecordControllerV1.invalidateSubrecordCacheForV1RecordScope();}}
function create(record,subrecordControllerV1){return new RecordImplV1(record,subrecordControllerV1);}
return{create:create};});define('N/record/subrecordImplV1Util',['N/record/recordUtilityFunctions','N/record/recordImplV1Util'],function(recordUtil,recordImplV1Util){function wrappedV1Subrecord(proxiedRecord)
{return!!proxiedRecord?recordImplV1Util.create(proxiedRecord):null;}
function createCurrentLineItemSubrecord(subrecordControllerV1,sublistId,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.createCurrentLineItemSubrecord(sublistId,fieldId));}
this.createCurrentLineItemSubrecord=createCurrentLineItemSubrecord;function editCurrentLineItemSubrecord(subrecordControllerV1,sublistId,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.editCurrentLineItemSubrecord(sublistId,fieldId));}
this.editCurrentLineItemSubrecord=editCurrentLineItemSubrecord;function removeCurrentLineItemSubrecord(subrecordControllerV1,sublistId,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.removeCurrentLineItemSubrecord(sublistId,fieldId));}
this.removeCurrentLineItemSubrecord=removeCurrentLineItemSubrecord;function viewCurrentLineItemSubrecord(subrecordControllerV1,sublistId,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.viewCurrentLineItemSubrecord(sublistId,fieldId));}
this.viewCurrentLineItemSubrecord=viewCurrentLineItemSubrecord;function viewLineItemSubrecord(subrecordControllerV1,sublistId,fieldId,line_1)
{var line_0=recordUtil.getZeroBasedIndex(line_1);return wrappedV1Subrecord(subrecordControllerV1.viewLineItemSubrecord(sublistId,fieldId,line_0));}
this.viewLineItemSubrecord=viewLineItemSubrecord;function createSubrecord(subrecordControllerV1,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.createSubrecord(fieldId));}
this.createSubrecord=createSubrecord;function editSubrecord(subrecordControllerV1,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.editSubrecord(fieldId));}
this.editSubrecord=editSubrecord;function viewSubrecord(subrecordControllerV1,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.viewSubrecord(fieldId));}
this.viewSubrecord=viewSubrecord;function removeSubrecord(subrecordControllerV1,fieldId)
{return wrappedV1Subrecord(subrecordControllerV1.removeSubrecord(fieldId));}
this.removeSubrecord=removeSubrecord;function commit(subrecordControllerV1,subrecordToCommit)
{return wrappedV1Subrecord(subrecordControllerV1.commit(subrecordToCommit));}
this.commit=commit;function invalidateSubrecordCacheEntry(subrecordControllerV1,sublistId,fieldId,line_0)
{subrecordControllerV1.invalidateSubrecordCacheEntry(sublistId,fieldId,line_0);}
this.invalidateSubrecordCacheEntry=invalidateSubrecordCacheEntry;function insertLineForSubrecordCache(subrecordControllerV1,sublistId,line)
{subrecordControllerV1.insertLineForSubrecordCache(sublistId,line);}
this.insertLineForSubrecordCache=insertLineForSubrecordCache;function removeLineForSubrecordCache(subrecordControllerV1,sublistId,line)
{subrecordControllerV1.removeLineForSubrecordCache(sublistId,line);}
this.removeLineForSubrecordCache=removeLineForSubrecordCache;function invalidateCurrentSublistLineForSubrecordCache(subrecordControllerV1,sublistId)
{subrecordControllerV1.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.invalidateCurrentSublistLineForSubrecordCache=invalidateCurrentSublistLineForSubrecordCache;function extendWithSubrecord(recordObject,subrecordV1)
{if(!!recordObject)
{recordObject.commit=commit.bind(null,subrecordV1);recordObject.createCurrentLineItemSubrecord=createCurrentLineItemSubrecord.bind(null,subrecordV1);recordObject.createSubrecord=createSubrecord.bind(null,subrecordV1);recordObject.editCurrentLineItemSubrecord=editCurrentLineItemSubrecord.bind(null,subrecordV1);recordObject.editSubrecord=editSubrecord.bind(null,subrecordV1);recordObject.insertLineForSubrecordCache=insertLineForSubrecordCache.bind(null,subrecordV1);recordObject.invalidateCurrentSublistLineForSubrecordCache=invalidateCurrentSublistLineForSubrecordCache.bind(null,subrecordV1);recordObject.invalidateSubrecordCacheEntry=invalidateSubrecordCacheEntry.bind(null,subrecordV1);recordObject.removeCurrentLineItemSubrecord=removeCurrentLineItemSubrecord.bind(null,subrecordV1);recordObject.removeLineForSubrecordCache=removeLineForSubrecordCache.bind(null,subrecordV1);recordObject.removeSubrecord=removeSubrecord.bind(null,subrecordV1);recordObject.viewCurrentLineItemSubrecord=viewCurrentLineItemSubrecord.bind(null,subrecordV1);recordObject.viewLineItemSubrecord=viewLineItemSubrecord.bind(null,subrecordV1);recordObject.viewSubrecord=viewSubrecord.bind(null,subrecordV1);}
return recordObject;}
return{extendWithSubrecord:extendWithSubrecord}});define('N/record/recordImplV1',['N/record/subrecordController','N/record/recordImplV1Util','N/record/subrecordImplV1Util'],function(subrecordController,recordImplV1Util,subrecordImplV1Util){function create(options){var record=options.record;var subrecordControllerV1=subrecordController.create(record);var v1RecordObj=recordImplV1Util.create(record,subrecordControllerV1);return subrecordImplV1Util.extendWithSubrecord(v1RecordObj,subrecordControllerV1);}
return{create:create};});define('N/scope',[],function(){var blacklist=['blacklist'];blacklist=blacklist.concat('error','parent','responseObj','scriptInfo');blacklist=blacklist.concat('argList','context','getParentPath','loadCallback','method','moduleName','pageMode','parentMap','parentPath','recordType','url');blacklist=blacklist.concat('SuiteScriptModuleLoaderError','addModuleNameToDefineModuleList','define','dependencyCheck','doLogExecution','forceSync','global','internals','isApiPath','isFilePathLike','isModuleNameAlreadyDefined','log','makeServerCall','namesOfDefinedModules','old_define','p','require','requirejs','serverCallAsync','serverCallSync','stripApiPath','toEmptyString','util');blacklist=blacklist.concat('callURL','createNode','getGlobalScope','legacyCallURL','nlRequestId','nlapi');return function(){eval(function(blacklist){return!!blacklist&&blacklist.map(function(v){return 'var '+v+' = undefined;';}).join('');}.bind(null,blacklist)());eval(function(blacklist){return!!blacklist&&blacklist.map(function(v){return 'var '+v+' = undefined;';}).join('');}.bind(null,arguments[0]&&arguments[0].blacklist)());eval(function(whitelist){return!!whitelist&&Object.keys(whitelist).map(function(v){return 'var '+v+' = arguments[0].whitelist["'+v+'"];';}).join('');}.bind(null,arguments[0]&&arguments[0].whitelist)());eval(function(libraries){return!!libraries&&libraries.join(';');}.bind(null,arguments[0]&&arguments[0].libraries)());return function(){return eval(arguments[0]);};};});define('N/util/recordScripting',['N/utilityFunctions'],function(utilityFunctions)
{function recordScriptingHandler(options){options=options||{};utilityFunctions.checkArgs([options.record],['options.record'],'recordScripting.create');var eventHandlerModules=options.eventHandlerModules||[];var scriptingContext=options.scriptingContext||{};var record=options.record;var listeners=[];function getKey(eventName,fieldName,sublistId){return String(String(sublistId||null)+':'+String(fieldName||null)+':'+String(eventName||null));}
(function constructor(){var wasSync=require.isSync();require.forceSync(true);try{for(var i=0;i<eventHandlerModules.length;i++){require([eventHandlerModules[i]],function(recordScriptImpl){listeners.push({});var sublists=(recordScriptImpl.sublists||{});(Object.keys(sublists)||[]).forEach(function(sublistName){var fieldsOrEvents=recordScriptImpl.sublists[sublistName]||{};var sublistFields=fieldsOrEvents.fields||{};(Object.keys(sublistFields)||[]).forEach(function(fieldName){var field=sublistFields[fieldName]||{};(Object.keys(field)||[]).forEach(function(eventName){if(util.isFunction(field[eventName]))
listeners[i][getKey(sublistName,fieldName,eventName)]=field[eventName];});});(Object.keys(fieldsOrEvents)||[]).forEach(function(eventName){if(util.isFunction(fieldsOrEvents[eventName]))
listeners[i][getKey(sublistName,null,eventName)]=fieldsOrEvents[eventName];});});var fields=recordScriptImpl.fields||{};(Object.keys(fields)||[]).forEach(function(fieldName){var field=fields[fieldName]||{};(Object.keys(field)||[]).forEach(function(eventName){if(util.isFunction(field[eventName]))
listeners[i][getKey(null,fieldName,eventName)]=field[eventName];});});var eventNames=Object.keys(recordScriptImpl)||{};eventNames.forEach(function(eventName){if(util.isFunction(recordScriptImpl[eventName]))
listeners[i][getKey(null,null,eventName)]=recordScriptImpl[eventName];});});}}
finally{require.forceSync(wasSync);}})();this.runStaticEvent=function runStaticEvent(eventName,fieldName,sublistId,originalArgs){var eventResults={};var isValid=true;var key=getKey(sublistId,fieldName,eventName);listeners.forEach(function(listener){var event=listener[key];if(event){eventResults[key]=event({currentRecord:record,scriptingContext:scriptingContext,params:originalArgs});isValid=isValid&&eventResults[key];}});eventResults.valid=isValid;return eventResults;}}
return{create:function(options){return new recordScriptingHandler(options);}};});define('N/record/recordScriptingScope',['N/record/recordConstants','N/utilityFunctions','N/util/currencyUtility','N/util/date','N/error','N/restricted/invoker','N/restricted/scopeRemoteApiBridge','N/record/recordImplV1','N/scope','N/msgRouter','N/search','N/search/searchUtil','N/environment','N/util/recordScripting','N/util'],function(constants,utilityFunctions,currencyutil,dateutil,error,invoker,remoteApi,recordImpl,jsScope,msgRouter,search,searchUtil,environment,recordScripting,util)
{var undef=undefined;var clientScriptInvocationDepthCount=0;function isExecutionWithinAClientScript()
{return clientScriptInvocationDepthCount>0;}
function create(options)
{return new Scope(options);}
function Scope(options)
{var that=this;var coreRecord=options.record;var record=recordImpl.create({record:coreRecord});var recordLibraryScript=options.libraryScript;var staticScript=options.staticScript;var uiFormScript=options.uiFormScript;var completePageInit=options.completePageInit;var NS;var parent=record;var shouldTriggerCustomFormLevelScript=options.shouldTriggerCustomFormLevelScript;var formLevelScript=options.formLevelScriptComponent?options.formLevelScriptComponent.script:null;var formLevelScriptAllText=options.formLevelScriptComponent?options.formLevelScriptComponent.libraryScript:null;var shouldTriggerCustomClientScript=options.shouldTriggerCustomClientScript;var clientScriptList=options.clientScriptComponent?options.clientScriptComponent.scriptList:null;var clientScriptAllText=options.clientScriptComponent?options.clientScriptComponent.libraryScript:null;var workflowScript=options.workflowScript;if(shouldTriggerCustomClientScript&&clientScriptList)
{var loadedClientScripts={};var numV2ClientScripts=0;clientScriptList.forEach(function(script){if(script.version!=="1.0"){numV2ClientScripts++;require([script.scriptInfo],function(module){loadedClientScripts[script.scriptId]=module;});}});}
if(shouldTriggerCustomFormLevelScript&&formLevelScript&&formLevelScript.version!=="1.0")
{var loadedFormScript;require([formLevelScript.scriptInfo],function(module)
{loadedFormScript=module;});}
if(workflowScript&&!util.isString(workflowScript)&&workflowScript.version!=="1.0")
{var loadedWorkflowScript;require([workflowScript.scriptInfo],function(module)
{loadedWorkflowScript=module;});}
var currentActiveScriptId=null;var clientScriptScopes={};function uiFormScriptWrapper(){eval(uiFormScript);}
function evaluateUIFormScriptAndCleanUp()
{var triggerUiFormScriptWrapper=uiFormScriptWrapper.bind(that);triggerUiFormScriptWrapper();NS=that.NS;delete that.NS;}
evaluateUIFormScriptAndCleanUp();eval(staticScript);eval(recordLibraryScript);eval(workflowScript);var getV1ScopeSingleton=(function()
{var v1Scope=null;return function getV1ScopeSingleton(libraries)
{if(v1Scope===null)
{v1Scope=jsScope({blacklist:getV1ApiBlackList(),whitelist:utilityFunctions.addParameterToMap(utilityFunctions.addParameterToMap({},getV1ApiGrayList()),getV1ApiWhiteList()),libraries:libraries||[]});}
return v1Scope;}}());function createScriptScopes(version,libraries,uniqueDisplayId)
{if(version==='1.0')
{clientScriptScopes[uniqueDisplayId]=getV1ScopeSingleton(libraries);}
else
{clientScriptScopes[uniqueDisplayId]=jsScope({whitelist:{require:require,util:util,log:log},libraries:libraries});}}
var formAndClientScriptList=[];var formAndClientScriptAllTextList={};if(shouldTriggerCustomFormLevelScript)
{var formScriptRepresentation={version:formLevelScript.version,scriptId:'formscript'};formAndClientScriptList.push(formScriptRepresentation);formAndClientScriptAllTextList['formscript']=formLevelScriptAllText;}
if(workflowScript)
{var workflowScriptRepresentation={version:'1.0',scriptId:'workflowscript'};formAndClientScriptList.push(workflowScriptRepresentation);formAndClientScriptAllTextList['workflowscript']=workflowScript;}
if(shouldTriggerCustomClientScript)
{for(var i=0;i<clientScriptList.length;i++)
{var clientScript=clientScriptList[i];formAndClientScriptList.push(clientScript);formAndClientScriptAllTextList[clientScript.scriptId]=clientScriptAllText[clientScript.scriptId];}}
{var v1Libraries=formAndClientScriptList.filter(function(script)
{return script.version==='1.0';}).map(function(script)
{return formAndClientScriptAllTextList[script.scriptId];});for(var i=0;i<formAndClientScriptList.length;i++)
{var scriptRepresentation=formAndClientScriptList[i];var libraries=scriptRepresentation.version==='1.0'?v1Libraries:[formAndClientScriptAllTextList[scriptRepresentation.scriptId]];createScriptScopes(scriptRepresentation.version,libraries,scriptRepresentation.scriptId);}}
function runInternalScript(scriptContent)
{runInternalScriptAndReturnResult(scriptContent);}
function runInternalScriptAndAssert(scriptContent,code)
{try
{var result=runInternalScriptAndReturnResult(scriptContent);_assertValidation(result,code);return result;}
catch(e)
{_handleError(e);}}
function evaluateSlavingResponse(response)
{var slaveValues;eval(response);return slaveValues;}
this.evaluateSlavingResponse=evaluateSlavingResponse;function runInternalScriptAndReturnResult(scriptContent)
{var wasInternal=coreRecord.isInternal();try
{coreRecord.setInternalEvent(true);var toRet=eval(scriptContent);return toRet;}
catch(e)
{_handleError(e);}
finally
{coreRecord.setInternalEvent(wasInternal);}}
this.runInternalScriptAndReturnResult=runInternalScriptAndReturnResult;function runInternalScriptAndReturnBooleanResult(scriptContent)
{return!!runInternalScriptAndReturnResult(scriptContent);}
this.runInternalScriptAndReturnBooleanResult=runInternalScriptAndReturnBooleanResult;function runScript(scriptContent)
{try
{eval(scriptContent);}
catch(e)
{_handleError(e);}}
this.runScript=runScript;function _handleError(e)
{var err=e;if(e instanceof Error)
{if(e.userFacing!==undef&&e.userFacing!==null){err=error.create({name:e.name,message:e.message,userFacing:e.userFacing});}else{err=error.create({name:e.name,message:e.message});}}
throw err;}
function _assertValidation(result,code)
{if(utilityFunctions.isObject(result)&&result.hasOwnProperty('valid'))
{if(!result.valid)
{var errorObj;if(result.messages)
errorObj=error.create({name:'USER_ERROR',message:result.messages.join('\n')});else
errorObj=utilityFunctions.isInternalErrorCode(code)?utilityFunctions.createSuiteScriptError(code):error.create({name:'USER_ERROR',message:code});errorObj.validationDetail=result;throw errorObj;}}
else if(!result)
{invoker(remoteApi,'checkWarningMessageInSession',[],null,false);var errorObj=utilityFunctions.isInternalErrorCode(code)?utilityFunctions.createSuiteScriptError(code):error.create({name:'USER_ERROR',message:code});throw errorObj;}}
function _createArgumentsJSExpression(args)
{var innerArgs=JSON.stringify(args);innerArgs=innerArgs.substr(1,innerArgs.length-2);return '('+innerArgs+')';}
function _getFieldScript(sublistId,fieldId,fieldscripttype)
{var metadata=coreRecord.getMetadata().getFieldMetadata(sublistId,fieldId);return(metadata)?utilityFunctions.returnEmptyIfNull(metadata.getFieldScript(fieldscripttype)):'';}
function _pageInit()
{var scriptToRun='function NLRecordScripting_pageInit() { page_init(); }; NLRecordScripting_pageInit();';runInternalScript(scriptToRun);runClientScripts(PAGE_INIT_TRIGGER,['create']);}
this.pageInit=_pageInit;function _validateField(sublistId,fieldId,line,matrixColumn)
{var validationFieldScript=_getFieldScript(sublistId,fieldId,'validatefield');var errorMessage='Field validation failed for field: '+fieldId;if(!utilityFunctions.isValEmpty(validationFieldScript))
{var scriptDefinition='function NLRecordScripting_validateField(type,fld,linenum,bucket) {\n'+
' var valid = '+validationFieldScript+';\n'+
' return valid;\n};\n';var args=[sublistId,fieldId];if(line>0)
args.push(line);if(matrixColumn!=-1)
args.push(matrixColumn);var scriptInvoker='NLRecordScripting_validateField'+_createArgumentsJSExpression(args);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,errorMessage);}
runClientScripts(VALIDATE_FIELD_TRIGGER,[sublistId,fieldId,line,matrixColumn],errorMessage);}
this.validateField=_validateField;function _canCreateSubrecord(sublistId,fieldId,line)
{var canCreateSubrecordScript=_getFieldScript(sublistId,fieldId,'canCreateSubrecord');if(!utilityFunctions.isValEmpty(canCreateSubrecordScript))
{var wrappedScript='(function(type,fld,linenum){ '+canCreateSubrecordScript+'})(type,fld,linenum);';var scriptDefinition='function NLRecordScripting_canCreateSubrecord(type,fld,linenum) { var is_valid = '+wrappedScript+'; return is_valid; };\n';var args=[sublistId,fieldId];if(line>0)
{args.push(line);}
var scriptInvoker='NLRecordScripting_canCreateSubrecord'+_createArgumentsJSExpression(args);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,error.Type.FORM_VALIDATION_FAILED_YOU_CANNOT_CREATE_THIS_SUBRECORD);}}
this.canCreateSubrecord=_canCreateSubrecord;function _fieldChange(sublistId,fieldId,line,matrixColumn)
{var fieldChangeScript=_getFieldScript(sublistId,fieldId,'fieldchange');if(!utilityFunctions.isValEmpty(fieldChangeScript))
{var scriptDefinition='function NLRecordScripting_fieldChange(type,fld,linenum,bucket) { '+fieldChangeScript+' }\n';var args=[sublistId,fieldId];if(line>0)
{args.push(line);}
if(matrixColumn!==-1)
{args.push(matrixColumn);}
var scriptInvoker='NLRecordScripting_fieldChange'+_createArgumentsJSExpression(args);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScript(scriptToRun);}
runClientScripts(FIELD_CHANGED_TRIGGER,[sublistId,fieldId,line,matrixColumn]);}
this.fieldChange=_fieldChange;function _saveRecord(ignoreMandatoryFields)
{var scriptDefinition='function NLRecordScripting_saveRecord(ignoreMandatoryFields) {\n'+
' return save_record(ignoreMandatoryFields, true);\n};\n';var scriptInvoker='NLRecordScripting_saveRecord('+ignoreMandatoryFields+')';var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,error.Type.FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD);runClientScripts(SAVE_RECORD_TRIGGER,[],error.Type.FORM_VALIDATION_FAILED_YOU_CANNOT_SUBMIT_THIS_RECORD);}
this.saveRecord=_saveRecord;function _getSublistScript(sublistId,scriptingTrigger,args)
{var toRet='';var sublistScripts=coreRecord.getMetadata().getSublistScripts(sublistId,scriptingTrigger);if(!utilityFunctions.isValEmpty(sublistScripts))
{toRet=sublistScripts+args;}
return toRet;}
function _lineInit(sublistId)
{if(coreRecord.isSublistAnEditMachine(sublistId))
{var lineInitScript=_getSublistScript(sublistId,'lineinit','()');if(!utilityFunctions.isValEmpty(lineInitScript))
{var scriptDefinition='function NLRecordScripting_lineInit(type) { '+lineInitScript+'; nlapiLineInit(type);};\n';var scriptInvoker='NLRecordScripting_lineInit'+_createArgumentsJSExpression([sublistId]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScript(scriptToRun);}
runClientScripts(LINE_INIT_TRIGGER,[sublistId]);}}
this.lineInit=_lineInit;function _lineCommit(sublistId,line)
{var lineCommitScript=_getSublistScript(sublistId,'linecommit','(linenum)');if(coreRecord.isSublistAnEditMachine(sublistId)&&!utilityFunctions.isValEmpty(lineCommitScript))
{var scriptDefinition='function NLRecordScripting_lineCommit(type, linenum) { '+lineCommitScript+'; nlapiLineCommit(type, linenum); };\n';var scriptInvoker='NLRecordScripting_lineCommit'+_createArgumentsJSExpression([sublistId,line]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScript(scriptToRun);}}
this.lineCommit=_lineCommit;function _postDeleteLine(sublistId,line)
{var postDeleteLineScript=_getSublistScript(sublistId,'postdeleteline','');if(coreRecord.isSublistAnEditMachine(sublistId)&&!utilityFunctions.isValEmpty(postDeleteLineScript))
{var scriptDefinition='function NLRecordScripting_postDeleteLine(type, linenum) { var hndlr = '+postDeleteLineScript+'; hndlr(linenum); };\n';var scriptInvoker='NLRecordScripting_postDeleteLine'+_createArgumentsJSExpression([sublistId,line]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScript(scriptToRun);}}
this.postDeleteLine=_postDeleteLine;function _validateLine(sublistId)
{if(coreRecord.isSublistAnEditMachine(sublistId))
{var validationLineScript=_getSublistScript(sublistId,'validateline','()')||'true';var errorMessage='Line validation failed for sublist: '+sublistId;var scriptDefinition='function NLRecordScripting_validateLine(type) {\n'+
' var valid = '+validationLineScript+';\n'+
' if (validationResultToBoolean(valid))\n'+
'  valid = nlapiValidateLine(type, true);\n'+
' return valid;\n};\n';var scriptInvoker='NLRecordScripting_validateLine'+_createArgumentsJSExpression([sublistId]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,errorMessage);runClientScripts(VALIDATE_LINE_TRIGGER,[sublistId],errorMessage);}}
this.validateLine=_validateLine;function _validateInsert(sublistId)
{if(coreRecord.isSublistAnEditMachine(sublistId))
{var validationInsertScript=_getSublistScript(sublistId,'validateinsert','()')||'true';var errorMessage='Line insert validation failed for sublist: '+sublistId;var scriptDefinition='function NLRecordScripting_validateInsert(type) {\n'+
' var valid = '+validationInsertScript+';\n'+
' if (validationResultToBoolean(valid))\n'+
'  valid = nlapiValidateInsert(type);\n'+
' return valid;\n};\n';var scriptInvoker='NLRecordScripting_validateInsert'+_createArgumentsJSExpression([sublistId]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,errorMessage);runClientScripts(VALIDATE_INSERT_TRIGGER,[sublistId],errorMessage);}}
this.validateInsert=_validateInsert;function _validateDelete(sublistId)
{if(coreRecord.isSublistAnEditMachine(sublistId))
{var validationDeleteScript=_getSublistScript(sublistId,'validatedelete','()')||'true';var errorMessage='Line delete validation failed for sublist: '+sublistId;var scriptDefinition='function NLRecordScripting_validateDelete(type) {\n'+
' var valid = '+validationDeleteScript+';\n'+
' if (validationResultToBoolean(valid))\n'+
'  valid = nlapiValidateDelete(type);\n'+
' return valid;\n};\n';var scriptInvoker='NLRecordScripting_validateDelete'+_createArgumentsJSExpression([sublistId]);var scriptToRun=scriptDefinition+scriptInvoker;runInternalScriptAndAssert(scriptToRun,errorMessage);runClientScripts(VALIDATE_DELETE_TRIGGER,[sublistId],errorMessage);}}
this.validateDelete=_validateDelete;function _recalc(sublistId,localRecalc,operation)
{if(operation===undef)
{operation='commit';}
var recalcScript=_getSublistScript(sublistId,'recalc','');if(coreRecord.isSublistAnEditMachine(sublistId)||(localRecalc&&!coreRecord.isSublistAnEditMachine(sublistId)))
{if(!utilityFunctions.isValEmpty(recalcScript))
{var scriptDefinition='function NLRecordScripting_recalc(type) { '+recalcScript+'; nlapiRecalc(type, false, \''+operation+'\'); };\n';var scriptInvoker='NLRecordScripting_recalc(\''+sublistId+'\');';var scriptToRun=scriptDefinition+scriptInvoker;runInternalScript(scriptToRun);}
runClientScripts(RECALC_TRIGGER,[sublistId,operation]);}}
this.recalc=_recalc;function _postSublistSourcing(postSourcingScript)
{runInternalScript(postSourcingScript);}
this.postSublistSourcing=_postSublistSourcing;function _postSourcing(sublistId,fieldId,line)
{runClientScripts(POST_SOURCING_TRIGGER,[sublistId,fieldId,line]);}
this.postSourcing=_postSourcing;function invalidateSubrecordCache(subrecordSublistId,subrecordFieldId,line)
{record.invalidateSubrecordCacheEntry(subrecordSublistId,subrecordFieldId,line);}
this.invalidateSubrecordCache=invalidateSubrecordCache;function _notifyInsertLine(sublistId,line)
{record.insertLineForSubrecordCache(sublistId,line);}
this.notifyInsertLine=_notifyInsertLine;function _notifyRemoveLine(sublistId,line)
{record.removeLineForSubrecordCache(sublistId,line);}
this.notifyRemoveLine=_notifyRemoveLine;function _notifyCurrentSublistLineReset(sublistId)
{record.invalidateCurrentSublistLineForSubrecordCache(sublistId);}
this.notifyCurrentSublistLineReset=_notifyCurrentSublistLineReset;var PAGE_INIT_TRIGGER='pageInit';var SAVE_RECORD_TRIGGER='saveRecord';var LINE_INIT_TRIGGER='lineInit';var VALIDATE_DELETE_TRIGGER='validateDelete';var VALIDATE_INSERT_TRIGGER='validateInsert';var VALIDATE_LINE_TRIGGER='validateLine';var RECALC_TRIGGER='recalc';var SUBLIST_CHANGED_TRIGGER='sublistChanged';var POST_SOURCING_TRIGGER='postSourcing';var VALIDATE_FIELD_TRIGGER='validateField';var FIELD_CHANGED_TRIGGER='fieldChanged';var caresAboutReturn=[SAVE_RECORD_TRIGGER,VALIDATE_DELETE_TRIGGER,VALIDATE_INSERT_TRIGGER,VALIDATE_LINE_TRIGGER,VALIDATE_FIELD_TRIGGER];var workflowTriggers=[VALIDATE_FIELD_TRIGGER,FIELD_CHANGED_TRIGGER,POST_SOURCING_TRIGGER,PAGE_INIT_TRIGGER,SAVE_RECORD_TRIGGER];function doesTriggerCareAboutReturn(trigger)
{return caresAboutReturn.indexOf(trigger)>-1;}
function isWorkflowTrigger(trigger)
{return workflowTriggers.indexOf(trigger)>-1;}
function runLegacyScript(script)
{var scope=getV1ScopeSingleton();return scope(script);}
this.runLegacyScript=runLegacyScript;function runWorkflowClientScript(trigger,args)
{var scope=clientScriptScopes['workflowscript'];var script="workflow_trigger"+_createArgumentsJSExpression([trigger].concat(args));return scope(script);}
function runClientScripts(trigger,args,errorMessage)
{var stillLoadingScripts=((workflowScript&&!util.isString(workflowScript)&&workflowScript.version!=="1.0"&&isWorkflowTrigger(trigger)&&!loadedWorkflowScript)||(formLevelScript&&formLevelScript.version!=="1.0"&&!loadedFormScript)||(clientScriptList&&Object.keys(loadedClientScripts).length!==numV2ClientScripts));if(typeof setTimeout!=="undefined"&&stillLoadingScripts)
{setTimeout(runClientScripts,0,trigger,args,errorMessage);return;}
else if(typeof setTimeout==="undefined"&&stillLoadingScripts)
{throw new Error("Failed to load record customizations");}
var returnMatters=doesTriggerCareAboutReturn(trigger);if(workflowScript&&isWorkflowTrigger(trigger))
{var scriptResult=runWorkflowClientScript(trigger,args);returnMatters&&_assertValidation(scriptResult,errorMessage);}
if(formLevelScript)
{currentActiveScriptId=null;scriptResult=runClientScriptWithTracking(trigger,args,formLevelScript,'formscript');returnMatters&&_assertValidation(scriptResult,errorMessage);}
if(clientScriptList)
{for(var i=0;i<clientScriptList.length;i++)
{var clientScript=clientScriptList[i];currentActiveScriptId=clientScript.scriptId;scriptResult=runClientScriptWithTracking(trigger,args,clientScript,clientScript.scriptId);returnMatters&&_assertValidation(scriptResult,errorMessage);}}
if(typeof completePageInit==='function'&&trigger===PAGE_INIT_TRIGGER)
{completePageInit();}}
function runClientScriptWithTracking(trigger,args,theScript,uniqueDisplayId)
{var isValid;clientScriptInvocationDepthCount++;try
{isValid=runClientScript(trigger,args,theScript,uniqueDisplayId);}
finally
{clientScriptInvocationDepthCount--;if(clientScriptInvocationDepthCount<0)
utilityFunctions.throwSuiteScriptError(error.Type.FAILED_AN_UNEXPECTED_ERROR_OCCURRED);}
return isValid;}
function runClientScript(trigger,args,theScript,uniqueDisplayId)
{var isValid;var contextArgs;var runMe;var scope=clientScriptScopes[uniqueDisplayId];var prevScript=invoker(remoteApi,'getScript',[]);invoker(remoteApi,'setupScript',[theScript]);msgRouter.pushQueue(coreRecord);try
{if(theScript.version==='1.0')
{contextArgs=_createArgumentsJSExpression(args);runMe=JSON.parse(theScript.scriptInfo)[trigger];isValid=(!!runMe)?scope(runMe+contextArgs):true;}
else
{contextArgs=organizeArgs(trigger,args);var thisTrigger=(trigger===RECALC_TRIGGER)?SUBLIST_CHANGED_TRIGGER:trigger;runMe='_v2f_'+uniqueDisplayId;require.forceSync(true);isValid=scope(runMe).apply(null,[thisTrigger,contextArgs]);require.forceSync(false);}}
catch(e){util.extend(e,{csError:{trigger:trigger,scriptInfo:invoker(remoteApi,'getScript',[])}});throw(e);}
finally
{invoker(remoteApi,'recoverScript',[prevScript]);msgRouter.popQueue();}
return isValid;}
function organizeArgs(trigger,args)
{function getZeroBasedIndex(idx)
{if(isNaN(idx))
{return idx;}
else
{idx=parseInt(idx,10);return(idx<0)?idx:idx-1;}}
var exposedCurrentRecord=coreRecord.proxy({isInteractive:environment.isNewUI()});var returnMe;switch(trigger)
{case PAGE_INIT_TRIGGER:returnMe={currentRecord:exposedCurrentRecord,mode:args[0]};break;case SAVE_RECORD_TRIGGER:returnMe={currentRecord:exposedCurrentRecord};break;case LINE_INIT_TRIGGER:case VALIDATE_DELETE_TRIGGER:case VALIDATE_INSERT_TRIGGER:case VALIDATE_LINE_TRIGGER:returnMe={currentRecord:exposedCurrentRecord,sublistId:args[0]};break;case RECALC_TRIGGER:returnMe={currentRecord:exposedCurrentRecord,sublistId:args[0],operation:args[1]};break;case POST_SOURCING_TRIGGER:returnMe={currentRecord:exposedCurrentRecord,sublistId:args[0],fieldId:args[1],line:getZeroBasedIndex(args[2])};break;case VALIDATE_FIELD_TRIGGER:case FIELD_CHANGED_TRIGGER:returnMe={currentRecord:exposedCurrentRecord,sublistId:args[0],fieldId:args[1],line:getZeroBasedIndex(args[2]),column:getZeroBasedIndex(args[3])};break;default:returnMe={};}
return returnMe;}}
return{create:create,isExecutionWithinAClientScript:isExecutionWithinAClientScript};});define('N/notification',[],function(){var TYPE=Object.freeze({CONFIRMATION:0,INFORMATION:1,WARNING:2,ERROR:3});function Severity(type)
{Object.defineProperty(this,'value',{get:function()
{return type;},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function()
{return getLabel(type);},enumerable:true,configurable:false});}
function getLabel(severity)
{var label='Confirmation';switch(severity)
{case TYPE.INFORMATION:label='Information';break;case TYPE.WARNING:label='Warning';break;case TYPE.ERROR:label='Error';break;}
return label;}
return Object.freeze({Type:TYPE,create:function(args)
{return new Severity(args);}});});define('N/saveResult',['N/notification','N/utilityFunctions'],function(notification,utilityFunctions)
{var SEVERITY=Object.freeze({CONFIRMATION:notification.create(notification.Type.CONFIRMATION),INFORMATION:notification.create(notification.Type.INFORMATION),WARNING:notification.create(notification.Type.WARNING),ERROR:notification.create(notification.Type.ERROR)});function SaveResult(options,result)
{Object.defineProperty(this,'recordData',{get:function()
{return new RecordData(result['recordData']);},enumerable:true,configurable:false});Object.defineProperty(this,'notifications',{get:function()
{return createArrayMessages(result.notifications);},enumerable:true,configurable:false});}
function createArrayMessages(array)
{var result=new Array();for(var i=0;i<array.length;i++)
{var oldMsg=array[i];result.push(new SaveMessage(oldMsg,isExpandedErrorMessage(oldMsg)));}
return result;}
function isExpandedErrorMessage(oldMsg)
{return!utilityFunctions.isEmpty(oldMsg['errorStack']);}
function RecordData(recordData)
{Object.defineProperty(this,'id',{get:function()
{return recordData.id;},enumerable:true,configurable:false});Object.defineProperty(this,'label',{get:function()
{return recordData.label;},enumerable:true,configurable:false});if(recordData.redirectUrl!=null){Object.defineProperty(this,'redirectUrl',{get:function()
{return recordData.redirectUrl;},enumerable:true,configurable:false});}}
function SaveMessage(saveMessage,error)
{Object.defineProperty(this,'id',{get:function()
{return saveMessage.id;},enumerable:true,configurable:false});Object.defineProperty(this,'title',{get:function()
{return saveMessage.title;},enumerable:true,configurable:false});Object.defineProperty(this,'message',{get:function()
{return saveMessage.message;},enumerable:true,configurable:false});Object.defineProperty(this,'severity',{get:function()
{switch(saveMessage.type)
{case notification.Type.INFORMATION:return SEVERITY.INFORMATION;break;case notification.Type.WARNING:return SEVERITY.WARNING;break;case notification.Type.ERROR:return SEVERITY.ERROR;break;default:return SEVERITY.CONFIRMATION;break;}},enumerable:true,configurable:false});if(error)
{Object.defineProperty(this,'name',{get:function()
{return saveMessage.name;},enumerable:true,configurable:false});Object.defineProperty(this,'errorStack',{get:function()
{return saveMessage.errorStack;},enumerable:true,configurable:false});Object.defineProperty(this,'scriptMetadata',{get:function()
{return new ScriptMetadata(saveMessage.scriptMetadata);},enumerable:true,configurable:false});}}
function ScriptMetadata(scriptData)
{Object.defineProperty(this,'id',{get:function()
{return scriptData.id;},enumerable:true,configurable:false});Object.defineProperty(this,'type',{get:function()
{return scriptData.type;},enumerable:true,configurable:false});Object.defineProperty(this,'internalId',{get:function()
{return scriptData.internalId;},enumerable:true,configurable:false});Object.defineProperty(this,'deployment',{get:function()
{return new Deployment(scriptData);},enumerable:true,configurable:false});}
function Deployment(scriptData){Object.defineProperty(this,'id',{get:function(){return scriptData.deploymentId;},enumerable:true,configurable:false});Object.defineProperty(this,'internalId',{get:function(){return scriptData.deploymentInternalId;},enumerable:true,configurable:false});}
return Object.freeze({create:function(options,results)
{return Object.freeze(new SaveResult(options,results));}});});define('N/macro',['N/utilityFunctions','N/msgRouter','N/record/recordProxy','N/error','N/restricted/invoker','N/environment','N/notification','N/runtime'],function(utilityFunctions,msgRouter,recordProxy,error,invoker,environment,notification,runtime)
{function isServerSide(){return(typeof(window)==='undefined');}
function isRecordScripting(){var script=runtime.getCurrentScript();return(script.id==null||script.id==-1)&&runtime.executionContext===runtime.ContextType.CLIENT;}
var getCachedMetadata=(function(){var macroMetadataCache=[];return function(options)
{options=options||{};var macroMetadata;if(options.record&&options.record.hasOwnProperty('type')&&options.record.hasOwnProperty('toString'))
{var cacheKey;var record=recordProxy.unproxy(options.record);var isReadOnly=!isServerSide()&&(record.hasOwnProperty('getIsReadOnlyRecord')?record.getIsReadOnlyRecord():!record.isDynamic);if(record.type)
cacheKey=record.type+(isReadOnly?"_readOnly":"");if(!macroMetadataCache[cacheKey])
{if(record&&record.getMacroMetadata)
macroMetadata=record.getMacroMetadata()||[];if(cacheKey)
macroMetadataCache[cacheKey]=macroMetadata;}
else
{macroMetadata=macroMetadataCache[cacheKey]||[];}}
var macroList=[];macroMetadata.forEach(function(metadata)
{var macro={id:metadata.id,'package':metadata['package'],label:metadata.label,description:metadata.description,attributes:metadata.attributes};if(!options.limited){for(var data in metadata)
macro[data]=metadata[data];}
macroList.push(macro);});return macroList;}})();function getMacroMetadata(options)
{return getCachedMetadata(options).filter(function(macro)
{return(macro.id===options.id&&macro['package']===options['package']);})[0];}
function getMacros(record)
{utilityFunctions.checkArgs([record],['record'],'Record.getMacros');var Macros={};getCachedMetadata({record:record}).forEach(function(macroDef){var macro=getMacro(record,{id:macroDef.id,'package':macroDef['package']});if(!macro['package'])
Macros[macro.id]=macro;else{if(Macros[macro['package']]===undefined){Macros[macro['package']]={};}
Macros[macro['package']][macro.id]=macro;}});return Object.freeze(Macros);}
function getMacro(record,options)
{var id,pckgId;if(options!==undefined&&options!==null)
{id=options.id;pckgId=options['package'];}
pckgId=pckgId||'';utilityFunctions.checkArgs([record],['record'],'Record.getMacro');utilityFunctions.checkArgsPresent([id],['id'],'Record.getMacro');utilityFunctions.assertTrue(util.isString(id),error.Type.SSS_INVALID_TYPE_ARG,'id');utilityFunctions.assertTrue(util.isString(pckgId),error.Type.SSS_INVALID_TYPE_ARG,'package');var macro=getMacroMetadata({'id':id,'package':pckgId,limited:true,record:record});if(!macro)
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_MACRO_ID,id);var Macro=function Macro(params)
{return record.executeMacro({'id':macro.id,'package':macro['package'],'params':params});};Macro.execute=function MacroExecute(params)
{return record.executeMacro({'id':macro.id,'package':macro['package'],'params':params});};Macro.promise=function MacroExecutePromise(params)
{return record.executeMacro.promise({'id':macro.id,'package':macro['package'],'params':params});};Macro.execute.promise=Macro.promise;var jsonDescription={};for(var attr in macro)
{if(macro.hasOwnProperty(attr))
{Macro[attr]=macro[attr];if(!!Macro[attr])
jsonDescription[attr]=Macro[attr];}}
Macro.toJSON=function(){return jsonDescription;};Macro.toString=function(){return 'Macro: '+JSON.stringify(Macro.toJSON());};return Object.freeze(Macro);}
function getExecuteMacroArgs(options)
{var id,pckgId,params;if(options!==undefined&&options!==null)
{id=options.id;pckgId=options['package'];params=options.params;}
if(id===undefined)
id=null;pckgId=pckgId||'';if(params===undefined)
params=null;return[id,pckgId,params];}
function clientExecuteMacro(record,options,callback)
{var proxiedRecord=record;if(!environment.isNewUI())
{if(record.isInteractive)
{var delegate=recordProxy.unproxy(record)||{};proxiedRecord=delegate.proxy?delegate.proxy({isInteractive:false}):record;}}
var args=getExecuteMacroArgs(options);var id=args[0];var pckgId=args[1];var params=args[2];utilityFunctions.checkArgs([record],['record'],'Record.executeMacro');utilityFunctions.checkArgsPresent([id],['id'],'Record.executeMacro');utilityFunctions.assertTrue(util.isString(id),error.Type.SSS_INVALID_TYPE_ARG,'id');utilityFunctions.assertTrue(util.isString(pckgId),error.Type.SSS_INVALID_TYPE_ARG,'package');var macroDef=getMacroMetadata({'id':id,'package':pckgId,record:record});if(!macroDef)
utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_MACRO_ID,id);var notifications=[];var context={context:macroDef.context,notifications:{add:function add(title,message,type)
{utilityFunctions.checkArgs([title,message,type],['title','message','type'],'notifications.add');var severity=notification.create(type);notifications.push({title:title,message:message,severity:severity});return this;},addInfo:function addInfo(title,message)
{return this.add(title,message,notification.Type.INFORMATION);},addWarning:function addWarning(title,message)
{return this.add(title,message,notification.Type.WARNING);},addError:function addError(title,message)
{return this.add(title,message,notification.Type.ERROR);}}};function getResult(response)
{if(response!=null&&!util.isObject(response))
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_RETURN_TYPE_EXPECTED_1,'Object');return{notifications:notifications,response:response||{}}}
var modulePath=macroDef.modulePath;var functionName=macroDef.id;if(callback)
{var macroHasPromise=false;require([modulePath],function(mod)
{var requirePromise=new Promise(function(requireResolve,requireReject)
{try
{var macroFunc=mod[functionName];if(macroFunc&&typeof(macroFunc.promise)==='function')
{macroFunc=macroFunc.promise;macroHasPromise=true;}
if(typeof(macroFunc)==='function')
requireResolve(macroFunc);else
requireReject(error.create(error.Type.SSS_INVALID_MACRO_ID));}
catch(e)
{utilityFunctions.throwSuiteScriptError(error.Type.FAILED_AN_UNEXPECTED_ERROR_OCCURRED);}});requirePromise.then(function(macroFunc){msgRouter.pushQueue(record);if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.prepareForAsync({info:{},record:record});try
{var response=macroFunc.apply(context,[proxiedRecord,params]);}
finally
{msgRouter.popQueue();if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.unloadAsync();}
if(response instanceof Promise)
{response.then(getResult).then(callback,callback.bind(null,undefined));}
else
{if(macroHasPromise)
utilityFunctions.throwSuiteScriptError(error.Type.INVALID_RETURN_TYPE_EXPECTED_1,'Promise');else
callback(getResult(response));}})['catch'](function(macroErr){callback(undefined,macroErr);});});}
else
{var macroFunc;require.forceSync(true);try
{require([modulePath],function(mod)
{macroFunc=mod[functionName];});}
finally
{require.forceSync(false);}
if(typeof(macroFunc)==='function')
{msgRouter.pushQueue(record);if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.prepareForAsync({info:{},record:record});try
{var response=macroFunc.apply(context,[proxiedRecord,params]);}
finally
{msgRouter.popQueue();if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.unloadAsync();}}
else
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_MACRO_ID,id);}
return getResult(response);}}
function processServerResult(callback,result,exception)
{if(exception===undefined)
{result=JSON.parse(result);if(!callback)
return result;else
return callback(result);}
else
{exception=error.create(JSON.parse(exception.message));if(!callback)
throw exception;else
return callback(undefined,exception);}}
function serverExecuteMacro(record,options,callback)
{var result,exception;try
{result=invoker(this,'executeMacro',getExecuteMacroArgs(options),callback&&processServerResult.bind(null,callback));}
catch(e)
{exception=e;}
return processServerResult(callback&&(function(){}),result,exception);}
var doExecuteMacro=(isServerSide()&&!isRecordScripting())?serverExecuteMacro:clientExecuteMacro;var executeMacro=function executeMacro(record,options){msgRouter.pushQueue(record);if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.prepareForAsync({info:{},record:record});try{return doExecuteMacro.call(this,record,options,null);}
finally{if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.unloadAsync();msgRouter.popQueue();}};executeMacro.promise=function executeMacroPromise(record,options){return new Promise(function(resolve,reject){var queueCount=msgRouter.pushQueue(record);if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.prepareForAsync({info:{},record:record});try{var callback=function callback(result,exception){if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.unloadAsync();msgRouter.popQueue(queueCount);if(exception===undefined){resolve(result);}else{reject(exception);}};doExecuteMacro.call(this,record,options,callback);}
catch(e){if(typeof(nlapi)!=='undefined'&&nlapi&&nlapi.async)nlapi.async.unloadAsync();msgRouter.popQueue(queueCount);reject(e);}});};return Object.freeze({getMacros:getMacros,getMacro:getMacro,executeMacro:executeMacro});});define('N/common/record/recordDefinition',['N/restricted/recordApi','N/restricted/recordRemoteApiBridge','N/restricted/invoker','N/record/recordConstants','N/utilityFunctions','N/error','N/field','N/metadata/fieldMetadata','N/record/metadata','N/record/recordStateController','N/record/recordField','N/record/matrix','N/record/sublist','N/metadata/sublistMetadata','N/common/record/line/lineDefinition','N/util','N/util/formatter','N/util/validator','N/util/slaving','N/record/recordProxy','N/record/relatedRecord','N/record/modelController','N/record/recordUtilityFunctions','N/record/recordImplementation','N/record/subrecordUtilityFunctions','N/record/recordScriptingScope','N/common/record/recordDefinitionEvent','N/eventEmitter','N/common/record/recordActualWork','N/saveResult','N/msgRouter','N/macro'],function(apiBridge,remoteApi,invoker,constants,utilityFunctions,error,field,fieldMetadata,metadata,recordStateController,recordfield,matrix,sublist,sublistMD,lineDefinition,util,formatter,validator,slaving,recordProxy,relatedRecord,modelController,recordUtil,recordImplementation,subrecordUtil,scope,recordDefinitionEvent,eventEmitter,recordBehaviorDelegateService,saveResult,msgRouter,macro)
{var undef=undefined;function getCopyContainer()
{var result;var copies=null;function add(obj)
{if(!contains(obj))
{copies=copies||[];copies.push(obj);}
return result;}
function clear()
{copies=null;return result;}
function contains(obj)
{return copies!==null&&copies.some(function(v)
{return v===obj;});}
function execute(func)
{if(!!copies)
{copies.forEach(function(copy)
{func(copy);});}}
result={add:add,clear:clear,contains:contains,execute:execute};return result;}
function Record(options)
{var freshCopies=getCopyContainer();var recordObj=util.extend({},options.recordObj);recordObj.id=recordObj.id?parseInt(recordObj.id,10):null;recordObj.isSubrecord=!!recordObj.isSubrecord;recordObj.isReadOnly=!!recordObj.isReadOnly;recordObj.isDynamic=!!recordObj.isDynamic;recordObj.isCurrentRecord=!!recordObj.isCurrentRecord;var compressEvents=!!recordObj&&!!recordObj.data&&!!recordObj.data.initialization&&!!recordObj.data.initialization.params&&typeof recordObj.data.initialization.params.compressEvents!=='undefined'?!!recordObj.data.initialization.params.compressEvents:true;var emitter=eventEmitter.create({eventTypes:Object.keys(recordDefinitionEvent.Type).map(function(v){return recordDefinitionEvent.Type[v];}),async:typeof setTimeout==='function',insulated:true,preProcessor:compressEvents?recordDefinitionEvent.eventCompress:recordDefinitionEvent.eventNoCompress});var implementation;var recordBehaviorDelegate=recordBehaviorDelegateService.create({delegate:this});var v1ScopeOptions=null;var that=this;var _metadata,_modelController,_state,_recordRequestContext,_recordScriptingV1Scope;var isInternalEvent=false;var isInited=false;var subrecordParent,subrecordSublistId,subrecordFieldId,subrecordValidated=false,subrecordDead=false,subrecordReadOnly=false;var subrecordIsDereferencedFromParent=false;var subrecordSublistState,subrecordFieldState,subrecordCompatibility;var SUBRECORD_KEY_FIELDID_REGEX=/^(parent\.){1}\w+$/;var lineCache={};var actionCache={};function getLineObjectFromCache(sublistId,lineInstanceId,useBuffer)
{var obj=lineCache;if(!obj[sublistId])
{obj[sublistId]={};}
obj=obj[sublistId];if(!obj[lineInstanceId])
{obj[lineInstanceId]={};}
obj=obj[lineInstanceId];if(!obj[useBuffer])
{obj[useBuffer]=constructLineObject(sublistId,lineInstanceId,useBuffer);}
obj=obj[useBuffer];return obj;}
this.getLineObjectFromCache=getLineObjectFromCache;function removeLineObjectFromCache(sublistId,lineInstanceId,useBuffer)
{if(sublistId!==undefined)
{if(lineInstanceId!==undefined)
{if(useBuffer!==undefined)
{delete lineCache[sublistId][lineInstanceId][useBuffer];}
else
{delete lineCache[sublistId][lineInstanceId];}}
else
{delete lineCache[sublistId];}}
else
{lineCache={};}}
var RECORD_SPECIFIC_SAVE_OPTIONS={'timesheet':['savesubmit']};var sublistEventListeners={change:[function(data)
{invalidateSubrecordClones();}]};function invalidateSubrecordClones()
{freshCopies.execute(function(clone)
{clone.setDereferencedFromParent(true);clone.setReadonly();});freshCopies.clear();}
this.invalidateSubrecordClones=invalidateSubrecordClones;function getRecordStateController(){return _state;}
this.getRecordStateController=getRecordStateController;function setRecordStateController(state)
{invalidateSubrecordClones();_state=state;recordDefinitionEvent.forwardRecordStateEvents(emitter,that);}
this.setRecordStateController=setRecordStateController;function resetsetRecordStateController()
{setRecordStateController(recordStateController.create({metadata:getMetadata(),data:getModelController(),getModelController:getModelController}));}
this.resetsetRecordStateController=resetsetRecordStateController;function getMetadata(){return _metadata;}
this.getMetadata=getMetadata;function setMetadata(metadata)
{invalidateSubrecordClones();_metadata=metadata;recordDefinitionEvent.forwardMetadataEvents(emitter,that);}
function getModelController(){return _modelController;}
this.getModelController=getModelController;function setModelController(modelController)
{invalidateSubrecordClones();_modelController=modelController;recordDefinitionEvent.forwardModelControllerEvents({record:that,emitter:emitter});}
this.setModelController=setModelController;function getCurrentRecordDelegate()
{var useBuffer=true;return{currentRecord:that,util:{isEditableSublist:isSublistAnEditMachine,isFieldMultiSelect:isFieldMultiSelect,setFieldNoSlaving:function setFieldNoSlaving(sublistId,fieldId,line,noSlaving)
{var fieldState=!!sublistId?getSublistFieldState(sublistId,fieldId,line,useBuffer):getFieldState(fieldId);fieldState.ignoreSlaving=noSlaving;},getFieldOptions:getSelectOptionCache,isMultilineEditable:isMultilineEditable}};}
function getHack()
{return that;}
this.getHack=getHack;utilityFunctions.addReadOnlyProperty(this,'id',getId);utilityFunctions.addReadOnlyProperty(this,'type',getRecordType);utilityFunctions.addReadOnlyProperty(this,'isDynamic',function(){return getIsDynamicRecord();});utilityFunctions.addReadOnlyProperty(this,'query',getQuery);var messageService;this.getMessageService=function getMessageService()
{if(!messageService)
messageService=msgRouter.getMessageServiceInstance();return messageService;};function getRecordRequestContext(){return _recordRequestContext;}
this.getRecordRequestContext=getRecordRequestContext;function getId(){return recordObj.id?parseInt(recordObj.id,10):null;}
this.getId=getId;function getRecordType(){return _metadata.type;}
this.getRecordType=getRecordType;function getIsSubrecord(){return!!recordObj.isSubrecord;}
this.getIsSubrecord=getIsSubrecord;function getIsReadOnlyRecord(){return!!recordObj.isReadOnly;}
this.getIsReadOnlyRecord=getIsReadOnlyRecord;function getIsDynamicRecord(){return!!recordObj.isDynamic;}
this.getIsDynamicRecord=getIsDynamicRecord;function getIsCurrentRecord(){return!!recordObj.isCurrentRecord;}
this.getIsCurrentRecord=getIsCurrentRecord;function isNewRecord(){return parseInt(getId(),10)===-1||getId()===undef||getId()===null;}
this.isNewRecord=isNewRecord;function setIsInited(){isInited=true;}
function getIsInited(){return isInited;}
function shouldValidateField()
{return getIsInited()&&!isInternal();}
this.shouldValidateField=shouldValidateField;function shouldValidateFieldPermissions()
{return implementation.shouldValidateFieldPermissions();}
this.shouldValidateFieldPermissions=shouldValidateFieldPermissions;function setInternalEvent(internal)
{isInternalEvent=!!internal;}
this.setInternalEvent=setInternalEvent;function isInternal()
{return isInternalEvent;}
this.isInternal=isInternal;function isChanged()
{return _state.isChanged;}
function getLineInstanceId(sublistId,line,useBuffer)
{return implementation.getLineInstanceId(sublistId,line,useBuffer);}
function getMissingArgumentErrorMessageFillerValue(methodName)
{return 'Record'+'.'+methodName;}
this.getMissingArgumentErrorMessageFillerValue=getMissingArgumentErrorMessageFillerValue;function isWithinValidLineRange(sublistId,line)
{var lineNumberIndex=parseInt(line,10);return 0<=lineNumberIndex&&lineNumberIndex<doGetLineCount(sublistId);}
function isWithinValidLineRangeForFieldOnly(sublistId,line)
{var lineNumberIndex=parseInt(line,10);return 0<=lineNumberIndex&&lineNumberIndex<(doGetLineCount(sublistId)+(isMultilineEditable(sublistId)?0:1));}
function validateTextApi(isTextApi,fieldState,methodName,suggestedMethod)
{implementation.validateTextApi(isTextApi,fieldState,methodName,suggestedMethod);}
this.validateTextApi=validateTextApi;function isMultilineEditable(sublistId)
{return!!sublistId?doGetSublist(sublistId).isMultilineEditable:false;}
this.isMultilineEditable=isMultilineEditable;function validateLineIndex(lineNumberIndex,lowerBoundInclusive,upperBoundExclusive)
{if(lineNumberIndex===0&&lowerBoundInclusive===0&&upperBoundExclusive===0)
warnAboutMLBCurrentIndexProblem("ValidateLineIndex failure on all 0s.\nLikely sign that a selectNewLine should be called instead!\nProbably assuming a new line + selectLine on line 0.");implementation.validateLineIndex(lineNumberIndex,lowerBoundInclusive,upperBoundExclusive);}
this.validateLineIndex=validateLineIndex;function validateLineIndex_MLB(lineNumberIndex,sublistId,allowNewLineForOldWay)
{var adjust=!!allowNewLineForOldWay?1:0;var maxPossible=isMultilineEditable(sublistId)?getModelController().getNextNewLineIndex_MLB(sublistId):doGetLineCount(sublistId)+adjust;validateLineIndex(lineNumberIndex,0,maxPossible)}
this.validateLineIndex_MLB=validateLineIndex_MLB;function validateLineInstanceId(sublistId,lineInstanceId,useBuffer,allowFallback)
{var lineInstanceExists=getModelController().isSublistLineInstanceIdValid(sublistId,lineInstanceId,useBuffer,allowFallback);recordUtil.assertValidSublistOperation(lineInstanceExists);}
function getCachedOptionsForRecordField(sublistId,fieldId,line)
{return implementation.getCachedOptionsForRecordField(sublistId,fieldId,line);}
function getNoCopyToDefaultMapForSublist(sublistId)
{var sublistMetadata=getSublistMetadata(sublistId);var noCopyToDefaultMap={};if(!!sublistMetadata)
{var noCopyList=sublistMetadata.noCopyFields||[];noCopyList.forEach(function(fieldId){noCopyToDefaultMap[fieldId]=sublistMetadata.defaultValue[fieldId];});}
return noCopyToDefaultMap;}
function getSublistMetadata(sublistId)
{return _metadata.getSublistMetadata(sublistId);}
this.getSublistMetadata=getSublistMetadata;function getSublistType(sublistId)
{return _metadata.getSublistType(sublistId);}
this.getSublistType=getSublistType;function isSublistAnEditMachine(sublistId)
{return getSublistType(sublistId)==='edit';}
this.isSublistAnEditMachine=isSublistAnEditMachine;function isSublistEditable(sublistId)
{return getSublistMetadata(sublistId)&&getSublistMetadata(sublistId).isEditable;}
this.isSublistEditable=isSublistEditable;function isSublistAListMachine(sublistId)
{return getSublistType(sublistId)==='list';}
this.isSublistAListMachine=isSublistAListMachine;function isValidField(sublistId,fieldId)
{var isValid=false;if(sublistId!=null)
{isValid=isValidSublistField(sublistId,fieldId);}
else
{isValid=isValidBodyField(fieldId);}
return isValid;}
this.isValidField=isValidField;function isValidBodyField(fieldId)
{return _metadata.isValidField(fieldId);}
this.isValidBodyField=isValidBodyField;function isValidSublistField(sublistId,fieldId)
{return _metadata.isValidSublistField(sublistId,fieldId);}
this.isValidSublistField=isValidSublistField;function getSublistFieldState(sublistId,fieldId,line,useBuffer)
{var lineInstanceId=getLineInstanceId(sublistId,line,useBuffer);return getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
this.getSublistFieldState=getSublistFieldState;function getSublistState(sublistId)
{return getRecordStateController().getSublistState(sublistId);}
this.getSublistState=getSublistState;function getSublistFieldStateForInstance(sublistId,fieldId,lineInstancecId,useBuffer)
{var sublistState=getSublistState(sublistId);return sublistState!=null?sublistState.getFieldStateForInstance(fieldId,lineInstancecId,useBuffer):null;}
this.getSublistFieldStateForInstance=getSublistFieldStateForInstance;function setSublistIsChanged(sublistId,value)
{getSublistState(sublistId).isChanged=value;return that;}
function getFieldState(fieldId)
{return _state.getFieldState(fieldId);}
this.getFieldState=getFieldState;function hasFieldValueOrFieldExisted(fieldId)
{return getModelController().hasFieldValue(fieldId)||_metadata.isValidField(fieldId);}
function hasSublistFieldValueOrSublistFieldExisted(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getLineInstanceId(sublistId,line,useBuffer);return hasSublistLineValueOrSublistFieldExisted(sublistId,fieldId,lineInstanceId,useBuffer);}
function hasCurrentSublistFieldValueOrSublistFieldExisted(sublistId,fieldId)
{var lineInstanceId=getModelController().getSublistSelectedLineInstanceId(sublistId);return hasSublistLineValueOrSublistFieldExisted(sublistId,fieldId,lineInstanceId,true);}
function hasSublistLineValueOrSublistFieldExisted(sublistId,fieldId,lineInstanceId,useBuffer)
{return getModelController().hasSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)||isSublistFieldExisted(sublistId,fieldId);}
function isSublistFieldExisted(sublistId,fieldId)
{return _metadata.isValidSublistField(sublistId,fieldId);}
function isSublistValid(sublistId)
{return _metadata.isValidSublist(sublistId);}
this.isSublistValid=isSublistValid;function getFieldLevelMetadataForBodyField(fieldId)
{return _metadata.getFieldMetadata(undef,fieldId);}
this.getFieldLevelMetadataForBodyField=getFieldLevelMetadataForBodyField;function getFieldLevelMetadataForSublistField(sublistId,fieldId)
{return _metadata.getFieldMetadata(sublistId,fieldId);}
this.getFieldLevelMetadataForSublistField=getFieldLevelMetadataForSublistField;function extractInforFromFieldLevelMetadata(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return{fieldId:fieldId,sublistId:sublistId,radioSet:!!fieldLevelMetadata?fieldLevelMetadata.radioSet:undef,hasBlankString:!!fieldLevelMetadata?fieldLevelMetadata.hasBlankString:undef,blankString:!!fieldLevelMetadata?fieldLevelMetadata.blankString:undef,supplementedOptions:!!fieldLevelMetadata?fieldLevelMetadata.supplementedOptions:undef};}
this.extractInforFromFieldLevelMetadata=extractInforFromFieldLevelMetadata;function getFieldType(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata?fieldLevelMetadata.type:null;}
function isFieldNumeric(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata?fieldLevelMetadata.isNumeric:null;}
function isFieldCurrency(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata?fieldLevelMetadata.isCurrency:null;}
function isFieldTime(sublistId,fieldId)
{return getFieldType(sublistId,fieldId)===recordUtil.FIELD_TYPE.TIME;}
this.isFieldTime=isFieldTime;function isFieldTimeTrack(sublistId,fieldId)
{return getFieldType(sublistId,fieldId)===recordUtil.FIELD_TYPE.TIMETRACK;}
this.isFieldTime=isFieldTimeTrack;function isFieldMultiSelect(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.MULTISELECT;}
this.isFieldMultiSelect=isFieldMultiSelect;function isFieldSelectType(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata&&recordUtil.isSelectType(fieldLevelMetadata.type);}
this.isFieldSelectType=isFieldSelectType;function isFieldCheckbox(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.CHECKBOX;}
this.isFieldCheckbox=isFieldCheckbox;function isFieldRadio(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.RADIO;}
this.isFieldRadio=isFieldRadio;function isFieldSubrecordField(sublistId,fieldId)
{var fieldLevelMetadata=_metadata.getFieldMetadata(sublistId,fieldId);return fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.SUBRECORD_FIELD_TYPE;}
function getSlavingMetadata(sublistId,fieldId)
{var metadata=_metadata.getFieldMetadata(sublistId,fieldId);return metadata?metadata.slavingMetadata:null;}
this.getSlavingMetadata=getSlavingMetadata;function getClientSlavingMetadata(sublistId,fieldId)
{var metadata=_metadata.getFieldMetadata(sublistId,fieldId);return metadata?metadata.clientSlavingMetadata:null;}
this.getClientSlavingMetadata=getClientSlavingMetadata;function getMacroMetadata()
{return typeof recordObj.macro!=='undefined'&&recordObj.macro.macroMetadata||[];}
this.getMacroMetadata=getMacroMetadata;this.getMacros=recordDefinitionEvent.wrapEmitError({record:that,func:macro.getMacros,emitter:emitter});function getScriptingContext(){return typeof recordObj.scriptingContext!=='undefined'?recordObj.scriptingContext:null;}
this.getScriptingContext=getScriptingContext;function getEventHandlerModules(){return typeof recordObj.eventHandlerModules!=='undefined'?recordObj.eventHandlerModules:null;}
this.eventHandlerModules=getEventHandlerModules;this.getMacro=recordDefinitionEvent.wrapEmitError({record:that,func:macro.getMacro,emitter:emitter});this.executeMacro=recordDefinitionEvent.wrapEmitError({record:that,func:macro.executeMacro,emitter:emitter});this.executeMacro.promise=recordDefinitionEvent.wrapEmitError({record:that,func:macro.executeMacro.promise,emitter:emitter});function promiseTo(fn,options,postProcess)
{var myPromise=new Promise(function(resolve,reject)
{function callback(result,exception)
{if(exception)
{reject(exception);return;}
resolve(postProcess?postProcess(result,options):result);}
try
{fn(options,callback);}
catch(e)
{reject(e);}});return myPromise;}
function doExecuteAction(options,callback)
{var actionId,params,pkg;if(options!==undef&&options!==null)
{actionId=options.id;params=utilityFunctions.isObject(options.params)?options.params:{};pkg=options['package']||null;}
utilityFunctions.checkArgs([actionId],['id'],getMissingArgumentErrorMessageFillerValue('executeAction'));return invoker(remoteApi,'executeAction',[getRecordType(),pkg,actionId,getId(),params],callback,false);}
function executeAction(options)
{return JSON.parse(doExecuteAction(options,null));}
executeAction.promise=function(options)
{return promiseTo(doExecuteAction,options,JSON.parse);};this.executeAction=recordDefinitionEvent.wrapEmitError({record:that,func:executeAction,emitter:emitter});this.executeAction.promise=recordDefinitionEvent.wrapEmitError({record:that,func:executeAction.promise,emitter:emitter});function createAction(options)
{var TYPE='Action';var pkg=options['package']||null;var actionId=options.id;var Action=function(params)
{return executeAction(combineOpts(params,actionId,pkg));};Action.execute=function(params)
{return executeAction(combineOpts(params,actionId,pkg));};Action.promise=function(params)
{return promiseTo(doExecuteAction,combineOpts(params,actionId,pkg),JSON.parse);};Action.execute.promise=Action.promise;Action.id=actionId;Action.recordType=getRecordType();Action['package']=pkg;Action.label=options.label||null;Action.description=options.description||null;var params={};options.parameters.forEach(function(p)
{params[p.id]=p;delete p.id;});Action.parameters=params;Action.toJSON=function toJSON(concise)
{var res={};for(var p in Action)
{if(Action.hasOwnProperty(p)&&typeof Action[p]!=='function')
{if(!concise||(Action[p]!=null&&(Action[p].constructor!==Object||Object.keys(Action[p]).length>0)))
{res[p]=Action[p];}}}
return res;};Action.toString=function toString()
{return TYPE+JSON.stringify(Action.toJSON(true));};return Object.freeze(Action);}
function combineOpts(params,actionId,pkg)
{var combinedOpts={};combinedOpts.params=params;combinedOpts.id=actionId;combinedOpts['package']=pkg;return combinedOpts;}
function processGetActionsResult(jsonRes,options)
{var metadata=JSON.parse(jsonRes);actionCache[getRecordType().toLowerCase()]=jsonRes;var Actions={};for(var i=0;i<metadata.length;i++)
{var action=createAction(metadata[i]);var fullId=action['package']?action['package']+'.'+action.id:action.id;Actions[fullId]=action;}
return Object.freeze(Actions);}
function doGetActions(options,callback)
{var recordType=getRecordType().toLowerCase();if(!actionCache[recordType])
{return invoker(remoteApi,'getRecordActions',[recordType,null,null],callback,false);}
if(callback)
{callback(actionCache[recordType]);}
else
{return actionCache[recordType];}}
function getActions(options)
{return processGetActionsResult(doGetActions(options,null),options);}
getActions.promise=function(options)
{return promiseTo(doGetActions,options,processGetActionsResult);};this.getActions=recordDefinitionEvent.wrapEmitError({record:that,func:getActions,emitter:emitter});this.getActions.promise=recordDefinitionEvent.wrapEmitError({record:that,func:getActions.promise,emitter:emitter});function processGetActionResult(jsonRes,options)
{var metadata=JSON.parse(jsonRes);actionCache[getRecordType().toLowerCase()]=jsonRes;var result=null;var pkg=options['package']||'';for(var i=0;i<metadata.length;i++)
{var curPkg=metadata[i]['package']||'';if(curPkg===pkg&&options.id===metadata[i].id)
{result=createAction(metadata[i]);break;}}
if(result===null)
{utilityFunctions.throwSuiteScriptError(error.Type.SSS_INVALID_ACTION_ID);}
return result;}
function doGetAction(options,callback)
{var actionId=options?options.id:null;utilityFunctions.checkArgs([actionId],['id'],getMissingArgumentErrorMessageFillerValue('getAction'));return doGetActions(options,callback);}
function getAction(options)
{return processGetActionResult(doGetAction(options,null),options);}
getAction.promise=function(options)
{return promiseTo(doGetAction,options,processGetActionResult);};this.getAction=recordDefinitionEvent.wrapEmitError({record:that,func:getAction,emitter:emitter});this.getAction.promise=recordDefinitionEvent.wrapEmitError({record:that,func:getAction.promise,emitter:emitter});function removeField(options)
{var fieldId=recordUtil.handleOverloadingMethodsForSingleArgument(options,'fieldId',getMissingArgumentErrorMessageFillerValue('removeField'));doRemoveField(fieldId);}
this.removeField=recordDefinitionEvent.wrapEmitError({record:that,func:removeField,emitter:emitter});function doRemoveField(fieldId)
{if(hasFieldValueOrFieldExisted(fieldId))
{var oldValue=doGetValue(fieldId);getModelController().removeFieldValue(fieldId);_state.removeFieldState(fieldId);subrecord_updateFieldState(true);}}
this.doRemoveField=doRemoveField;function getFields()
{var allFields={};var bodyfields=getModelController().getBodyFieldIds();if(util.isArray(bodyfields))
{bodyfields.forEach(function(fieldId){allFields[fieldId]=true;});}
var fieldNames=_metadata.fieldIds;if(util.isArray(fieldNames))
{fieldNames.forEach(function(fieldId)
{if(isFieldSubrecordField(undef,fieldId))
{delete allFields[fieldId];}
else
{allFields[fieldId]=true;}});}
var uniqueFieldIds=[];recordUtil.forEachProperty(allFields,function(fieldId,value){uniqueFieldIds[uniqueFieldIds.length]=fieldId;});return uniqueFieldIds;}
this.getFields=getFields;function getSublists()
{return _metadata.sublistIds;}
this.getSublists=getSublists;function getValue(options)
{return recordBehaviorDelegate.getValue(options);}
this.getValue=getValue;function parseValue(isValidField,fieldLevelMetadata,value)
{var parsedValue;if(fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.CHECKBOX&&value==='')
{parsedValue=false;}
else if(!isValidField||(!value&&value!==false&&value!==0&&value!==''))
{parsedValue=value;}
else if(fieldLevelMetadata&&fieldLevelMetadata.isTypeMultiSelect)
{parsedValue=recordUtil.formatValueToArrayType(value).map(function(val){return String(val);});}
else if(fieldLevelMetadata&&fieldLevelMetadata.isTypeSelect)
{parsedValue=String(value);}
else
{parsedValue=formatter.parse(value,fieldLevelMetadata.type,fieldLevelMetadata.isNumeric,fieldLevelMetadata.isCurrency,fieldLevelMetadata.fieldTypeForValidation);}
return parsedValue;}
this.parseValue=parseValue;function getParsedValueForBodyField(fieldId,delegator)
{return implementation.getParsedValueForBodyField(fieldId,delegator);}
this.getParsedValueForBodyField=getParsedValueForBodyField;function getParsedSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var returnValue=doGetSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);var fs=getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer);var fieldLevelMetadata=getFieldLevelMetadataForSublistField(sublistId,fieldId);var isCheckbox=fieldLevelMetadata&&fieldLevelMetadata.type===recordUtil.FIELD_TYPE.CHECKBOX;if((fs&&!fs.isParsed)||(isCheckbox&&returnValue===''))
{var parsedValue=parseValue(isValidSublistField(sublistId,fieldId),fieldLevelMetadata,returnValue);getModelController().setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,parsedValue,useBuffer);fs.isParsed=true;returnValue=parsedValue;}
return returnValue;}
function doGetValue(fieldId)
{var hasFieldExisted=hasFieldValueOrFieldExisted(fieldId);var value=!hasFieldExisted?undef:getModelController().getFieldValue(fieldId);var metadata={hasFieldExisted:hasFieldExisted,isMultiSelect:isFieldMultiSelect(undef,fieldId)};return recordBehaviorDelegateService.handleMultiSelectAndVirtualFieldForReturnValue(value,metadata);}
this.doGetValue=doGetValue;function setParsedValueAndUpdateFieldState(fieldId,value,fieldState)
{getModelController().setParsedValueForBodyField(fieldId,value);fieldState.isParsed=true;}
this.setParsedValueAndUpdateFieldState=setParsedValueAndUpdateFieldState;function setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer)
{getModelController().setParsedValueForSublistFieldForInstance(sublistId,lineInstanceId,fieldId,value,useBuffer);}
this.setParsedValueForSublistFieldForInstance=setParsedValueForSublistFieldForInstance;function setValue(options,value,isInteractive)
{var fieldId,fireFieldChange=true,noSlaving=false;if(value!==undef||(options!==undef&&options.fieldId===undef&&typeof options==='string'))
{fieldId=options;}
else if(options!==undef&&options!==null)
{fieldId=options.fieldId;value=options.value;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;noSlaving=util.isBoolean(options.noslaving)?options.noslaving:noSlaving;isInteractive=util.isBoolean(options.isInteractive)?options.isInteractive:false;}
utilityFunctions.checkArgs([fieldId],['fieldId'],getMissingArgumentErrorMessageFillerValue('setValue'));recordUtil.validateAgainstSqlInjection(fieldId,value);doSetValue(fieldId,value,fireFieldChange,noSlaving,isInteractive);}
this.setValue=recordDefinitionEvent.wrapEmitError({record:that,func:setValue,emitter:emitter});function doSetValue(fieldId,value,fireFieldChange,noSlaving,isInteractive)
{implementation.doSetValue(fieldId,value,fireFieldChange,noSlaving,isInteractive);getFieldState(fieldId).useTextApi=false;}
this.doSetValue=doSetValue;function validateAndFormatFieldValue(sublistId,fieldId,value,skipParsing)
{return implementation.validateAndFormatFieldValue(sublistId,fieldId,value,skipParsing);}
this.validateAndFormatFieldValue=validateAndFormatFieldValue;function validateAndFormatFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,value,isInteractive)
{return implementation.validateAndFormatFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,value,isInteractive);}
this.validateAndFormatFieldValueForInstance=validateAndFormatFieldValueForInstance;function doSetFieldValue(fieldId,value,fireFieldChange,noSlaving,valueIsFormattedAsString,isUpdatingSlavingField)
{var newThingObject=getSetFieldMetadata(undef,fieldId);newThingObject.valueIsFormattedAsString=valueIsFormattedAsString;var valueObject=recordBehaviorDelegateService.createObjectToDoSetValue(value,newThingObject);getModelController().setFieldValue(fieldId,valueObject);var postSetObject=constructPostSetObject(undef,fieldId,valueObject.legacyStringValue,fireFieldChange,noSlaving,isUpdatingSlavingField);var lineInstance=null;var useBuffer=false;var fieldState=getFieldState(fieldId);fieldState.isParsed=!valueIsFormattedAsString;fieldState.isChanged=true;recordBehaviorDelegateService.postDoSetValueForInstance(that,postSetObject,lineInstance,useBuffer);}
this.doSetFieldValue=doSetFieldValue;function postSetFieldValue(sublistId,fieldId,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField)
{implementation.postSetFieldValue(sublistId,fieldId,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField);}
this.postSetFieldValue=postSetFieldValue;function postSetFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField)
{implementation.postSetFieldValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,dbValue,fireFieldChange,noSlaving,isUpdatingSlavingField);}
this.postSetFieldValueForInstance=postSetFieldValueForInstance;function doSlaving(sublistId,fieldId,line,value,noSlaving,restrictField)
{implementation.doSlaving(sublistId,fieldId,line,value,noSlaving,restrictField);}
this.doSlaving=doSlaving;function doSlavingForInstance(sublistId,fieldId,line,lineInstanceId,value,noSlaving,restrictField)
{implementation.doSlavingForInstance(sublistId,fieldId,line,lineInstanceId,value,noSlaving,restrictField);}
this.doSlavingForInstance=doSlavingForInstance;function doPostSendSlavingRequest(response)
{var slaveValues;if(!utilityFunctions.isValEmpty(response))
{slaveValues=_recordScriptingV1Scope.evaluateSlavingResponse(response);}
return slaveValues;}
function doHandleSlavingRequestAsync(slavingRequest)
{return new Promise(function(resolve,reject)
{try
{invoker(remoteApi,'sendSlavingRequest',[getRecordType(),slavingRequest.url,slavingRequest.payload],callback,false);}
catch(e)
{reject(e);}
function callback(result,exception)
{if(exception)
{reject(exception);return;}
try
{resolve(doPostSendSlavingRequest(result));}
catch(e)
{reject(e);}}});}
function sendSlavingRequest(slavingMetadata,masterFieldInfo)
{var slaveValuesOrPromise;var forceSync=(slavingMetadata&&slavingMetadata.forceSyncSlaving)?slavingMetadata.forceSyncSlaving:!getIsCurrentRecord();var slavingRequest=slaving.getQueryRequest(slavingMetadata,masterFieldInfo,getCurrentRecordDelegate());if(slavingRequest)
{slavingRequest.payload=prepareSlavingPayload(slavingRequest.payload);if(forceSync)
{var response=invoker(remoteApi,'sendSlavingRequest',[getRecordType(),slavingRequest.url,slavingRequest.payload],null,false);slaveValuesOrPromise=doPostSendSlavingRequest(response);}
else
{slaveValuesOrPromise=doHandleSlavingRequestAsync(slavingRequest);}}
return slaveValuesOrPromise;}
this.sendSlavingRequest=sendSlavingRequest;function prepareSlavingPayload(payload)
{payload.newslaving='T';payload.isCurrentRecord=getIsCurrentRecord();return payload;}
function applySlaveValues(slaveValues)
{var wasInternal=isInternal();setInternalEvent(true);if(slaveValues['machinesData'])
{applySlaveMachineResults(slaveValues['machinesData']);}
slaving.processSlavingValues(slaveValues['fields'],getCurrentRecordDelegate());if(util.isFunction(slaveValues['aspectScript']))
{slaveValues['aspectScript'].call();}
setInternalEvent(wasInternal);}
this.applySlaveValues=applySlaveValues;function applySlaveMachineResults(machineData)
{for(var sublistId in machineData)
{var sublistData=machineData[sublistId].data;var sublistMetadata=machineData[sublistId].metadata;var sublistSlaveScript=machineData[sublistId].metadata[0];getModelController().clearSublistData(sublistId);sublistData.forEach(function(sublistLineData,index)
{var line=index;getModelController().insertSublistLine(sublistId,line);sublistLineData.forEach(function(fieldValue,index)
{var fieldMetadata=sublistMetadata[index+1];var fieldId=fieldMetadata.name;var val=(typeof fieldValue==='object')?fieldValue.value:fieldValue;getModelController().setSublistLineValue(sublistId,fieldId,line,{value:val,legacyStringValue:val});if(typeof fieldValue==='object'&&(fieldValue.hasOwnProperty('options')||fieldMetadata.hasOwnProperty('defaultOptions')))
{var options=fieldMetadata.hasOwnProperty('defaultOptions')?fieldMetadata.defaultOptions:fieldValue.options;if(options.length>0)
{var selectOptions=getSelectOptionCache().get(sublistId,fieldId,line);selectOptions=util.isArray(selectOptions)?selectOptions:[];options.forEach(function(option)
{selectOptions.push({text:option[1],id:option[0]});});getSelectOptionCache().put(sublistId,fieldId,line,selectOptions);}}});});doResetSublistState(sublistId);invalidateSubrecordClones();triggerMachinePostSourcing(sublistSlaveScript);if(getSublistState(sublistId))
{getSublistState(sublistId).isChanged=true;}}}
function doResetSublistState(sublistId)
{_state.addSublist(sublistId,getModelController);invalidateSubrecordClones();}
function triggerMachinePostSourcing(postSourcingScript)
{implementation.triggerMachinePostSourcing(postSourcingScript);}
function triggerCustomPostSourcingScript(sublistId,fieldId,line)
{implementation.triggerCustomPostSourcingScript(sublistId,fieldId,line);}
this.triggerCustomPostSourcingScript=triggerCustomPostSourcingScript;function getText(options)
{return recordBehaviorDelegate.getText(options);}
this.getText=getText;function doGetText(fieldId,delegator)
{return implementation.doGetText(fieldId,delegator);}
this.doGetText=doGetText;function doGetTextValueForSupplementedSelectFieldForInstance(sublistId,fieldId,value,lineInstanceId,useBuffer)
{var select=getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);if(!!select.getSelectOptions)
{var opts=select.getSelectOptions();var results=opts.filter(function(v){return v.getId()===value;});if(results.length>0)
{return results[0].getText();}}}
this.doGetTextValueForSupplementedSelectFieldForInstance=doGetTextValueForSupplementedSelectFieldForInstance;function doGetTextValueForSelectFieldForInstance(sublistId,fieldId,value,lineInstanceId,useBuffer,isMultiSelect)
{var result=getModelController().getSelectOptionTextFromCache(sublistId,fieldId,value);if(result===undef)
{var select=getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);result=querySelectTextFromServer(value,select,isMultiSelect);getModelController().cacheSelectOptionText(sublistId,fieldId,value,result);}
return result;}
this.doGetTextValueForSelectFieldForInstance=doGetTextValueForSelectFieldForInstance;function querySelectTextFromServer(value,select,isMultiSelect)
{var callback=null;var shouldParseResult=false;var requestParam=select.getRequestParam();requestParam.push(value);return invoker(remoteApi,isMultiSelect?'getMultiSelectTextValue':'getSelectTextValue',requestParam,callback,shouldParseResult);}
function setText(options,text,isInteractive)
{var fieldId,fireFieldChange=true;if(text!==undef||(options!==undef&&options.fieldId===undef&&typeof options==='string'))
{fieldId=options;}
else if(options!==undef&&options!==null)
{fieldId=options.fieldId;text=options.text;fireFieldChange=util.isBoolean(options.ignoreFieldChange)?!options.ignoreFieldChange:fireFieldChange;isInteractive=util.isBoolean(options.isInteractive)?options.isInteractive:false;}
utilityFunctions.checkArgs([fieldId],['fieldId'],getMissingArgumentErrorMessageFillerValue('setText'));text=recordUtil.emptyIfNullOrUndefined(text);recordUtil.validateAgainstSqlInjection(fieldId,text);doSetText(fieldId,text,fireFieldChange,isInteractive);}
this.setText=recordDefinitionEvent.wrapEmitError({record:that,func:setText,emitter:emitter});function doSetText(fieldId,text,fireFieldChange,noSlaving,isUpdatingSlaveField)
{implementation.doSetText(fieldId,text,fireFieldChange,noSlaving,isUpdatingSlaveField);}
function doSetTexts(fieldId,texts,fireFieldChange,noSlaving)
{var sublistId=undef;var lineInstanceId=null;var useBuffer=false;var rf=getCachedRecordFieldForInstance(sublistId,fieldId,lineInstanceId,useBuffer);var values=rf.validateSelectFieldByText(texts);doSetFieldValue(fieldId,values,fireFieldChange,noSlaving);}
this.doSetTexts=doSetTexts;function findSublistLineWithValue(options,fieldId,value)
{var sublistId;if(fieldId!==undef&&value!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;value=options.value;}
utilityFunctions.checkArgs([sublistId,fieldId],['sublistId','fieldId'],getMissingArgumentErrorMessageFillerValue('findSublistLineWithValue'));return doFindSublistLineWithValue(sublistId,fieldId,value);}
this.findSublistLineWithValue=findSublistLineWithValue;function doFindSublistLineWithValue(sublistId,fieldId,value)
{for(var lineIndex=0;lineIndex<doGetLineCount(sublistId);lineIndex++)
{var foundValue=doGetSublistValue(sublistId,fieldId,lineIndex);if(value==foundValue||('F'===foundValue&&value===false)||('T'===foundValue&&value===true))
{return lineIndex;}}
return-1;}
this.doFindSublistLineWithValue=doFindSublistLineWithValue;function getSublistValue(options,fieldId,line)
{var useBuffer=false;var sublistId;if(fieldId!==undef&&line!==undef)
{sublistId=options;}
else if(options!==undef&&options!==null)
{sublistId=options.sublistId;fieldId=options.fieldId;line=options.line;}
utilityFunctions.checkArgs([sublistId,fieldId,line],['sublistId','fieldId','line'],getMissingArgumentErrorMessageFillerValue('getSublistValue'));validateTextApi(false,getSublistFieldState(sublistId,fieldId,line,useBuffer),'setSublistText','getSublistText');return isWithinValidLineRange(sublistId,line)?doGetParsedSublistValue(sublistId,fieldId,line):undef;}
this.getSublistValue=getSublistValue;function doGetParsedSublistValue(sublistId,fieldId,line)
{validateLineIndex_MLB(line,sublistId,false);var value=undef;if(line>=0)
{var useBuffer=false;var lineInstanceId=getLineInstanceId(sublistId,line,useBuffer);var lineDefinitionObject=getLineObjectFromCache(sublistId,lineInstanceId,useBuffer);value=lineDefinitionObject.getParsedValueForBodyField(fieldId);}
return value;}
function doGetParsedSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator)
{return implementation.doGetParsedSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer,delegator);}
this.doGetParsedSublistValueForInstance=doGetParsedSublistValueForInstance;function doGetSublistValue(sublistId,fieldId,line)
{var useBuffer=false;var lineInstanceId=getLineInstanceId(sublistId,line,useBuffer);return doGetSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);}
function doGetSublistValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer)
{var hasFieldExisted=hasSublistLineValueOrSublistFieldExisted(sublistId,fieldId,lineInstanceId,useBuffer);var value=!hasFieldExisted?undef:getModelController().getSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,useBuffer);var metadata={hasFieldExisted:hasFieldExisted,isMultiSelect:isFieldMultiSelect(sublistId,fieldId)};return recordBehaviorDelegateService.handleMultiSelectAndVirtualFieldForReturnValue(value,metadata);}
this.doGetSublistValueForInstance=doGetSublistValueForInstance;function setSublistValue(options,fieldId,line,value)
{implementation.setSublistValue(options,fieldId,line,value);}
this.setSublistValue=recordDefinitionEvent.wrapEmitError({record:that,func:setSublistValue,emitter:emitter});function doSetSublistValue(sublistId,fieldId,line,value)
{var useBuffer=false;var lineInstanceId=getLineInstanceId(sublistId,line,useBuffer);finishSetSublistValueForInstance(sublistId,fieldId,lineInstanceId,value,useBuffer);}
this.doSetSublistValue=doSetSublistValue;function finishSetSublistValueForInstance(sublistId,fieldId,lineInstanceId,value,useBuffer)
{if(isSublistValid(sublistId))
{var valueObject=recordBehaviorDelegateService.createObjectToDoSetSublistValue(value,getSetFieldMetadata(sublistId,fieldId));getModelController().setSublistLineValueForInstance(sublistId,fieldId,lineInstanceId,valueObject,useBuffer);recordBehaviorDelegateService.postDoSetSublistValueForInstance(that,sublistId,fieldId,lineInstanceId,useBuffer);}}
function doSetSublistValueForInstance(sublistId,fieldId,lineInstanceId,value,fireFieldChange,useBuffer,isInteractive)
{if(useBuffer)
{doSetSublistBufferValue(sublistId,fieldId,lineInstanceId,value,fireFieldChange,false,isInteractive);}
else
{finishSetSublistValueForInstance(sublistId,fieldId,lineInstanceId,value,useBuffer);}
getSublistFieldStateForInstance(sublistId,fieldId,lineInstanceId,useBuffer).useTextApi=false;}
this.doSetSublistValueForInstance=doSetSublistValueForInstance;function getSetFieldMetadata(sublistId,fieldId)
{return{isValidField:isValidField(sublistId,fieldId),isMultiSelect:isFieldMultiSelect(sublistId,fieldId),isSelect:isFieldSelectType(sublistId,fieldId),isRadio:isFieldRadio(sublistId,fieldId),isNumeric:isFieldNumeric(sublistId,fieldId),isCurrency:isFieldCurrency(sublistId,fieldId),type:getFieldType(sublistId,fieldId)};}
this.getSetFieldMetadata=getSetFieldMetadata;function getSublistText(options,fieldId,line)
{var sublistId;i
