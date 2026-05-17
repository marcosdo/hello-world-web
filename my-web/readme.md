
# Haciendo una página web: mkdo.es

Guía paso a paso. Se ha seguido la guía de Amazon:

> User Guide
> Amazon Simple Storage Service
> API Version 2006-03-01
> Copyright © 2026 Amazon Web Services, Inc. and/or its affiliates. All rights reserved
> 
> Ver: [Amazon Simple Storage Service](https://docs.aws.amazon.com/pdfs/AmazonS3/latest/userguide/s3-userguide.pdf#WebsiteHosting)

## Pre-requisitos 

### Registrar 

Antes de nada, se ha debido registrar y configurar un dominio. En este caso se ha registrado el dominio `mkdo.es`

### Configurar un dominio

Para cofigurar un dominio en *Amazon Route 53* se puede usar la guía de Amazon:

> Developer Guide
> Amazon Route 53
> API Version 2013-04-01
> Copyright © 2026 Amazon Web Services, Inc. and/or its affiliates. All rights reserved
> 
> Ver: [Amazon Route 53](https://docs.aws.amazon.com/pdfs/Route53/latest/DeveloperGuide/route53-dg.pdf#domain-register)

### Registrar un dominio

En mi caso, el dominio no se ha registrado con Amazon así que voy a: 

> 
> **Amazon Route 53 Developer Guide**
>
> [Making Amazon Route 53 the DNS service for an existing domain.](https://docs.aws.amazon.com/pdfs/Route53/latest/DeveloperGuide/route53-dg.pdf#%5B%7B%22num%22%3A23688%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C402.36%2Cnull%5D)
>

1. *Get your current DNS configuration from the current DNS service provider
(inactive domains)*

Como la configuración DNS es simple, tan solo debemos crear manualmente algunas entradas en la consola de *Route 53*.

2. *Create a hosted zone (inactive domains)*

>
> **Amazon Route 53 Developer Guide**
>
> To create a hosted zone:
>
> 1. Sign in to the AWS Management Console and open the Route 53 console at https://console.aws.amazon.com/route53/.
> 2. If you're new to Route 53, choose Get started.
If you're already using Route 53, choose Hosted zones in the navigation pane.
> 3. Choose Create hosted zone.
> 4. In the Create hosted zone pane, enter a domain name and, optionally, a comment. For more information about a setting, pause the mouse pointer over its label to see a tool tip.
For information about how to specify characters other than a-z, 0-9, and - (hyphen) and how
to specify internationalized domain names, see DNS domain name format.
> 5. For Record type, accept the default value of Public hosted zone.
> 6. Choose Create hosted zone.

3. *Create records (inactive domains)*

> 
> **Amazon Route 53 Developer Guide**
>
> If you can't get a zone file or if you want to manually create records in Route 53, the records that you're likely to migrate include the following:
> - A (Address) records – associate a domain name or subdomain name with the IPv4 address (for example, 192.0.2.3) of the corresponding resource
> - AAAA (Address) records – associate a domain name or subdomain name with the IPv6 address (for example, 2001:0db8:85a3:0000:0000:*abcd*:0001:2345) of the corresponding resource
> - Mail server (MX) records – route traffic to mail servers
> - CNAME records – reroute traffic for one domain name (example.net) to another domain name (example.com)
> - Records for other supported DNS record types – For a list of supported record types, see [Supported DNS record types](https://docs.aws.amazon.com/pdfs/Route53/latest/DeveloperGuide/route53-dg.pdf#%5B%7B%22num%22%3A27317%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C174.444%2Cnull%5D).
>

4. *Update the domain registration to use Amazon Route 53 name server (inactive domains)*

>
> **Amazon Route 53 Developer Guide**
>
> To update the name servers for the domain
> 1. In the Route 53 console, get the name servers for your Route 53 hosted zone:
>     1. Open the Route 53 console at https://console.aws.amazon.com/route53/.
>     2. In the navigation pane, choose Hosted zones.
>     3. On the Hosted zones page, choose the radio button (not the name) for the hosted zone, then choose View details.
>    5. On the details page for the hosted zone, choose Hosted zone details.
>    6. Make note of the four servers listed for Name servers.
> 2. Use the method provided by the registrar for the domain to change the name servers for the domain to use the four Route 53 name servers that you got in step 2 of this procedure.
> If the domain is registered with Route 53, see [Adding or changing name servers and glue records for a domain](https://docs.aws.amazon.com/pdfs/Route53/latest/DeveloperGuide/route53-dg.pdf#%5B%7B%22num%22%3A5184%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C213.1%2Cnull%5D).
>

## Paso 1: Crear un S3

> 
> **Amazon Simple Storage Service User Guide**
> 
> To create a bucket
> 1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.
> 2. In the navigation bar on the top of the page, choose the name of the currently displayed AWS Region. Next, choose the Region in which you want to create a bucket.
> 3. In the left navigation pane, choose **General purpose buckets**.
> 4. Choose **Create bucket**. The **Create bucket** page opens.
> 5. For **Bucket name**, enter a name for your bucket (for example, **tutorial-bucket**).
For more information about naming buckets in Amazon S3, see [General purpose bucket naming rules](https://docs.aws.amazon.com/pdfs/AmazonS3/latest/userguide/s3-userguide.pdf#%5B%7B%22num%22%3A5882%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C227.108%2Cnull%5D).
> 6. For **Region**, choose the AWS Region where you want the bucket to reside.
If possible, you should pick the Region that is closest to the majority of your viewers. For more information about the bucket Region, see General purpose buckets overview.
> 7. For **Block Public Access settings for this bucket**, keep the default settings (**Block *all* public access** is enabled).
Even with Block all public access enabled, viewers can still access the uploaded video through CloudFront. This feature is a major advantage of using CloudFront to host a video stored in S3.
We recommend that you keep all settings enabled unless you need to turn off one or more of them for your use case. For more information about blocking public access, see [Blocking public access to your Amazon S3 storage](https://docs.aws.amazon.com/pdfs/AmazonS3/latest/userguide/s3-userguide.pdf#%5B%7B%22num%22%3A71755%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C496.818%2Cnull%5D).
> 8. For the remaining settings, keep the defaults.
(Optional) If you want to configure additional bucket settings for your specific use case, see [Creating a general purpose bucket](https://docs.aws.amazon.com/pdfs/AmazonS3/latest/userguide/s3-userguide.pdf#%5B%7B%22num%22%3A6663%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C36%2C368.72%2Cnull%5D).
> 9. Choose **Create bucket**.
>

## Paso 2: Subir archivos al S3

En mi caso son ficheros de texto, pero el método es el mismo:

> 
> **Amazon Simple Storage Service User Guide**
> 
> To upload a file to the bucket
> 1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.
> 2. In the left navigation pane, choose **General purpose buckets**
> 3. In the **General purpose buckets** list, choose the name of the bucket that you created in Step 1 (for example, **tutorial-bucket**) to upload your file to.
> 4. On the **Objects** tab for your bucket, choose **Upload**.
> 5. On the **Upload** page, under **Files and folders**, choose **Add files**.
> 6. Choose a file to upload, and then choose **Open**.
For example, you can upload a video file named sample.mp4
> 7.  Choose **Upload**.
>

## Paso 3: Crear en CloudFront un OAC (Origin Access Control)



## Paso 4: Crear una distribución de CloudFront

>
> **Amazon Simple Storage Service User Guide**
> 
> Create a CloudFront distribution
> 1. Sign in to the AWS Management Console and open the CloudFront console at https://console.aws.amazon.com/cloudfront/v4/home.
> 2. In the left navigation pane, choose **Distributions**.
> 3. Choose **Create distribution**.
> 4. In the **Origin** section, for **Origin domain**, choose the domain name of your S3 origin, which starts with the name of the S3 bucket that you created in Step 1 (for example, **tutorial-bucket**).
> 5. For **Origin access**, choose **Legacy access identities**.
> 6. Under **Origin access identity**, choose the origin access identity that you created in Step 3 (for
example, S3-OAI).
> 7. Under **Bucket policy**, choose **Yes, update the bucket policy**.
> 8. In the **Default cache behavior** section, under **Viewer protocol policy**, choose **Redirect HTTP to HTTPS**.
When you choose this feature, HTTP requests are automatically redirected to HTTPS to secure your website and protect your viewers' data.
> 9. For the other settings in the **Default cache behaviors** section, keep the default values.
> (Optional) You can control how long your file stays in a CloudFront cache before CloudFront forwards another request to your origin. Reducing the duration allows you to serve dynamic content. Increasing the duration means that your viewers get better performance because your files are more likely to be served directly from the edge cache. A longer duration also reduces the load on your origin. For more information, see [Managing how long content stays in the cache (expiration)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) in the *Amazon CloudFront Developer Guide*.
> 10. For the other sections, keep the remaining settings set to the defaults
> For more information about the different settings options, see [Values That You Specify When You Create or Update a Distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html) in the *Amazon CloudFront Developer Guide*.
> 11.  At the bottom of the page, choose **Create distribution**.
> 12. On the **General** tab for your CloudFront distribution, under **Details**, the value of the **Last modified** column for your distribution changes from **Deploying** to the timestamp when the distribution was last modified. This process typically takes a few minutes.
>

>
> **Amazon Simple Storage Service User Guide**
>
> Review the bucket policy
> 1. Sign in to the AWS Management Console and open the Amazon S3 console at https://console.aws.amazon.com/s3/.
> 2. In the left navigation pane, choose Buckets.
> 3. In the Buckets list, choose the name of the bucket that you used earlier as the origin of your CloudFront distribution (for example, tutorial-bucket).
> 4. Choose the Permissions tab.
> 5. In the Bucket policy section, confirm that you see a statement similar to the following in the bucket policy text
>> {
>> ····"Version": "2008-10-17",
>> ····"Id": "PolicyForCloudFrontPrivateContent",
>> ····"Statement": [
>> ········{
>> ············"Sid": "1",
>> ············"Effect": "Allow",
>> ············"Principal": {
>> ················"AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity #############"
>> ············},
>> ············"Action": "s3:GetObject",
>> ············"Resource": "arn:aws:s3:::tutorial-bucket/*"
>> ········}
>> ····]
>> } 
>>
> 

