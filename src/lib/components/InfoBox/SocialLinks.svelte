<script lang="ts">
  import {
    IconBrandInstagram,
    IconBrandPatreon,
    IconBrandTwitter,
    IconLink,
  } from "@tabler/icons-svelte";
</script>

<div class="social-links">
  <a href="https://twitter.com" target="_blank">
    <IconBrandTwitter size={25} />
  </a>
  <a href="https://patreon.com" target="_blank">
    <IconBrandPatreon size={25} />
  </a>
  <a href="https://LofiEngine.com" target="_blank">
    <IconLink size={25} />
  </a>
</div>

<style>
  .social-links {
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin-top: 5px;
  }
  .social-links a {
    margin-right: 20px;
    color: white;
  }
  .social-links a:hover {
    opacity: 80%;
  }
</style>
